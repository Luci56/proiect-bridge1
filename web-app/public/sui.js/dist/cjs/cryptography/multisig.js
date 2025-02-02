"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var multisig_exports = {};
__export(multisig_exports, {
  MAX_SIGNER_IN_MULTISIG: () => MAX_SIGNER_IN_MULTISIG,
  combinePartialSigs: () => combinePartialSigs,
  decodeMultiSig: () => decodeMultiSig,
  toMultiSigAddress: () => toMultiSigAddress
});
module.exports = __toCommonJS(multisig_exports);
var import_bcs = require("@mysten/bcs");
var import_signature = require("./signature.js");
var import_utils = require("./utils.js");
var import_blake2b = require("@noble/hashes/blake2b");
var import_utils2 = require("@noble/hashes/utils");
var import_publickey = require("../keypairs/ed25519/publickey.js");
var import_publickey2 = require("../keypairs/secp256k1/publickey.js");
var import_publickey3 = require("../keypairs/secp256r1/publickey.js");
var import_bcs2 = require("../builder/bcs.js");
var import_sui_types = require("../utils/sui-types.js");
const MAX_SIGNER_IN_MULTISIG = 10;
function toMultiSigAddress(pks, threshold) {
  if (pks.length > MAX_SIGNER_IN_MULTISIG) {
    throw new Error(`Max number of signers in a multisig is ${MAX_SIGNER_IN_MULTISIG}`);
  }
  let maxLength = 1 + (64 + 1) * MAX_SIGNER_IN_MULTISIG + 2;
  let tmp = new Uint8Array(maxLength);
  tmp.set([import_signature.SIGNATURE_SCHEME_TO_FLAG["MultiSig"]]);
  let arr = to_uint8array(threshold);
  tmp.set(arr, 1);
  let i = 3;
  for (const pk of pks) {
    tmp.set([pk.pubKey.flag()], i);
    tmp.set(pk.pubKey.toRawBytes(), i + 1);
    tmp.set([pk.weight], i + 1 + pk.pubKey.toRawBytes().length);
    i += pk.pubKey.toRawBytes().length + 2;
  }
  return (0, import_sui_types.normalizeSuiAddress)((0, import_utils2.bytesToHex)((0, import_blake2b.blake2b)(tmp.slice(0, i), { dkLen: 32 })));
}
function combinePartialSigs(sigs, pks, threshold) {
  let multisig_pk = {
    pk_map: pks.map((x) => toPkWeightPair(x)),
    threshold
  };
  let bitmap = 0;
  let compressed_sigs = new Array(sigs.length);
  for (let i = 0; i < sigs.length; i++) {
    let parsed = (0, import_utils.toSingleSignaturePubkeyPair)(sigs[i]);
    let bytes2 = Array.from(parsed.signature.map((x) => Number(x)));
    if (parsed.signatureScheme === "ED25519") {
      compressed_sigs[i] = { ED25519: bytes2 };
    } else if (parsed.signatureScheme === "Secp256k1") {
      compressed_sigs[i] = { Secp256k1: bytes2 };
    } else if (parsed.signatureScheme === "Secp256r1") {
      compressed_sigs[i] = { Secp256r1: bytes2 };
    }
    for (let j = 0; j < pks.length; j++) {
      if (parsed.pubKey.equals(pks[j].pubKey)) {
        bitmap |= 1 << j;
        break;
      }
    }
  }
  let multisig = {
    sigs: compressed_sigs,
    bitmap,
    multisig_pk
  };
  const bytes = import_bcs2.builder.ser("MultiSig", multisig).toBytes();
  let tmp = new Uint8Array(bytes.length + 1);
  tmp.set([import_signature.SIGNATURE_SCHEME_TO_FLAG["MultiSig"]]);
  tmp.set(bytes, 1);
  return (0, import_bcs.toB64)(tmp);
}
function decodeMultiSig(signature) {
  const parsed = (0, import_bcs.fromB64)(signature);
  if (parsed.length < 1 || parsed[0] !== import_signature.SIGNATURE_SCHEME_TO_FLAG["MultiSig"]) {
    throw new Error("Invalid MultiSig flag");
  }
  const multisig = import_bcs2.builder.de("MultiSig", parsed.slice(1));
  let res = new Array(multisig.sigs.length);
  for (let i = 0; i < multisig.sigs.length; i++) {
    let s = multisig.sigs[i];
    let pk_index = as_indices(multisig.bitmap).at(i);
    let pk_bytes = Object.values(multisig.multisig_pk.pk_map[pk_index].pubKey)[0];
    const scheme = Object.keys(s)[0];
    if (scheme === "MultiSig") {
      throw new Error("MultiSig is not supported inside MultiSig");
    }
    const SIGNATURE_SCHEME_TO_PUBLIC_KEY = {
      ED25519: import_publickey.Ed25519PublicKey,
      Secp256k1: import_publickey2.Secp256k1PublicKey,
      Secp256r1: import_publickey3.Secp256r1PublicKey
    };
    const PublicKey = SIGNATURE_SCHEME_TO_PUBLIC_KEY[scheme];
    res[i] = {
      signatureScheme: scheme,
      signature: Uint8Array.from(Object.values(s)[0]),
      pubKey: new PublicKey(pk_bytes),
      weight: multisig.multisig_pk.pk_map[pk_index].weight
    };
  }
  return res;
}
function toPkWeightPair(pair) {
  let pk_bytes = Array.from(pair.pubKey.toBytes().map((x) => Number(x)));
  switch (pair.pubKey.flag()) {
    case import_signature.SIGNATURE_SCHEME_TO_FLAG["Secp256k1"]:
      return {
        pubKey: {
          Secp256k1: pk_bytes
        },
        weight: pair.weight
      };
    case import_signature.SIGNATURE_SCHEME_TO_FLAG["Secp256r1"]:
      return {
        pubKey: {
          Secp256r1: pk_bytes
        },
        weight: pair.weight
      };
    case import_signature.SIGNATURE_SCHEME_TO_FLAG["ED25519"]:
      return {
        pubKey: {
          ED25519: pk_bytes
        },
        weight: pair.weight
      };
    default:
      throw new Error("Unsupported signature scheme");
  }
}
function to_uint8array(threshold) {
  if (threshold < 0 || threshold > 65535) {
    throw new Error("Invalid threshold");
  }
  let arr = new Uint8Array(2);
  arr[0] = threshold & 255;
  arr[1] = threshold >> 8;
  return arr;
}
function as_indices(bitmap) {
  if (bitmap < 0 || bitmap > 1024) {
    throw new Error("Invalid bitmap");
  }
  let res = [];
  for (let i = 0; i < 10; i++) {
    if ((bitmap & 1 << i) !== 0) {
      res.push(i);
    }
  }
  return Uint8Array.from(res);
}
//# sourceMappingURL=multisig.js.map

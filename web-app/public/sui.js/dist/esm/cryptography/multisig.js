import { fromB64, toB64 } from "@mysten/bcs";
import { SIGNATURE_SCHEME_TO_FLAG } from "./signature.js";
import { toSingleSignaturePubkeyPair } from "./utils.js";
import { blake2b } from "@noble/hashes/blake2b";
import { bytesToHex } from "@noble/hashes/utils";
import { Ed25519PublicKey } from "../keypairs/ed25519/publickey.js";
import { Secp256k1PublicKey } from "../keypairs/secp256k1/publickey.js";
import { Secp256r1PublicKey } from "../keypairs/secp256r1/publickey.js";
import { builder } from "../builder/bcs.js";
import { normalizeSuiAddress } from "../utils/sui-types.js";
const MAX_SIGNER_IN_MULTISIG = 10;
function toMultiSigAddress(pks, threshold) {
  if (pks.length > MAX_SIGNER_IN_MULTISIG) {
    throw new Error(`Max number of signers in a multisig is ${MAX_SIGNER_IN_MULTISIG}`);
  }
  let maxLength = 1 + (64 + 1) * MAX_SIGNER_IN_MULTISIG + 2;
  let tmp = new Uint8Array(maxLength);
  tmp.set([SIGNATURE_SCHEME_TO_FLAG["MultiSig"]]);
  let arr = to_uint8array(threshold);
  tmp.set(arr, 1);
  let i = 3;
  for (const pk of pks) {
    tmp.set([pk.pubKey.flag()], i);
    tmp.set(pk.pubKey.toRawBytes(), i + 1);
    tmp.set([pk.weight], i + 1 + pk.pubKey.toRawBytes().length);
    i += pk.pubKey.toRawBytes().length + 2;
  }
  return normalizeSuiAddress(bytesToHex(blake2b(tmp.slice(0, i), { dkLen: 32 })));
}
function combinePartialSigs(sigs, pks, threshold) {
  let multisig_pk = {
    pk_map: pks.map((x) => toPkWeightPair(x)),
    threshold
  };
  let bitmap = 0;
  let compressed_sigs = new Array(sigs.length);
  for (let i = 0; i < sigs.length; i++) {
    let parsed = toSingleSignaturePubkeyPair(sigs[i]);
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
  const bytes = builder.ser("MultiSig", multisig).toBytes();
  let tmp = new Uint8Array(bytes.length + 1);
  tmp.set([SIGNATURE_SCHEME_TO_FLAG["MultiSig"]]);
  tmp.set(bytes, 1);
  return toB64(tmp);
}
function decodeMultiSig(signature) {
  const parsed = fromB64(signature);
  if (parsed.length < 1 || parsed[0] !== SIGNATURE_SCHEME_TO_FLAG["MultiSig"]) {
    throw new Error("Invalid MultiSig flag");
  }
  const multisig = builder.de("MultiSig", parsed.slice(1));
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
      ED25519: Ed25519PublicKey,
      Secp256k1: Secp256k1PublicKey,
      Secp256r1: Secp256r1PublicKey
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
    case SIGNATURE_SCHEME_TO_FLAG["Secp256k1"]:
      return {
        pubKey: {
          Secp256k1: pk_bytes
        },
        weight: pair.weight
      };
    case SIGNATURE_SCHEME_TO_FLAG["Secp256r1"]:
      return {
        pubKey: {
          Secp256r1: pk_bytes
        },
        weight: pair.weight
      };
    case SIGNATURE_SCHEME_TO_FLAG["ED25519"]:
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
export {
  MAX_SIGNER_IN_MULTISIG,
  combinePartialSigs,
  decodeMultiSig,
  toMultiSigAddress
};
//# sourceMappingURL=multisig.js.map

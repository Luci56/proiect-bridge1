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
var signature_exports = {};
__export(signature_exports, {
  SIGNATURE_FLAG_TO_SCHEME: () => SIGNATURE_FLAG_TO_SCHEME,
  SIGNATURE_SCHEME_TO_FLAG: () => SIGNATURE_SCHEME_TO_FLAG,
  SIGNATURE_SCHEME_TO_SIZE: () => SIGNATURE_SCHEME_TO_SIZE,
  parseSerializedSignature: () => parseSerializedSignature,
  toSerializedSignature: () => toSerializedSignature
});
module.exports = __toCommonJS(signature_exports);
var import_bcs = require("@mysten/bcs");
var import_bcs2 = require("../builder/bcs.js");
const SIGNATURE_SCHEME_TO_FLAG = {
  ED25519: 0,
  Secp256k1: 1,
  Secp256r1: 2,
  MultiSig: 3
};
const SIGNATURE_SCHEME_TO_SIZE = {
  ED25519: 32,
  Secp256k1: 33,
  Secp256r1: 33
};
const SIGNATURE_FLAG_TO_SCHEME = {
  0: "ED25519",
  1: "Secp256k1",
  2: "Secp256r1",
  3: "MultiSig"
};
function toSerializedSignature({
  signature,
  signatureScheme,
  pubKey,
  publicKey = pubKey
}) {
  if (!publicKey) {
    throw new Error("`publicKey` is required");
  }
  const pubKeyBytes = publicKey.toBytes();
  const serializedSignature = new Uint8Array(1 + signature.length + pubKeyBytes.length);
  serializedSignature.set([SIGNATURE_SCHEME_TO_FLAG[signatureScheme]]);
  serializedSignature.set(signature, 1);
  serializedSignature.set(pubKeyBytes, 1 + signature.length);
  return (0, import_bcs.toB64)(serializedSignature);
}
function parseSerializedSignature(serializedSignature) {
  const bytes = (0, import_bcs.fromB64)(serializedSignature);
  const signatureScheme = SIGNATURE_FLAG_TO_SCHEME[bytes[0]];
  if (signatureScheme === "MultiSig") {
    const multisig = import_bcs2.builder.de("MultiSig", bytes.slice(1));
    return {
      serializedSignature,
      signatureScheme,
      multisig,
      bytes
    };
  }
  if (!(signatureScheme in SIGNATURE_SCHEME_TO_SIZE)) {
    throw new Error("Unsupported signature scheme");
  }
  const size = SIGNATURE_SCHEME_TO_SIZE[signatureScheme];
  const signature = bytes.slice(1, bytes.length - size);
  const publicKey = bytes.slice(1 + signature.length);
  return {
    serializedSignature,
    signatureScheme,
    signature,
    publicKey,
    bytes
  };
}
//# sourceMappingURL=signature.js.map

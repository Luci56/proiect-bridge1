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
var utils_exports = {};
__export(utils_exports, {
  fromExportedKeypair: () => fromExportedKeypair,
  publicKeyFromSerialized: () => publicKeyFromSerialized,
  toParsedSignaturePubkeyPair: () => toParsedSignaturePubkeyPair,
  toSingleSignaturePubkeyPair: () => toSingleSignaturePubkeyPair
});
module.exports = __toCommonJS(utils_exports);
var import_bcs = require("@mysten/bcs");
var import_signature = require("./signature.js");
var import_publickey = require("../keypairs/secp256r1/publickey.js");
var import_publickey2 = require("../keypairs/secp256k1/publickey.js");
var import_publickey3 = require("../keypairs/ed25519/publickey.js");
var import_multisig = require("./multisig.js");
var import_keypair = require("../keypairs/ed25519/keypair.js");
var import_keypair2 = require("../keypairs/secp256k1/keypair.js");
var import_keypair3 = require("./keypair.js");
function toParsedSignaturePubkeyPair(serializedSignature) {
  const bytes = (0, import_bcs.fromB64)(serializedSignature);
  const signatureScheme = import_signature.SIGNATURE_FLAG_TO_SCHEME[bytes[0]];
  if (signatureScheme === "MultiSig") {
    try {
      return (0, import_multisig.decodeMultiSig)(serializedSignature);
    } catch (e) {
      throw new Error("legacy multisig viewing unsupported");
    }
  }
  const SIGNATURE_SCHEME_TO_PUBLIC_KEY = {
    ED25519: import_publickey3.Ed25519PublicKey,
    Secp256k1: import_publickey2.Secp256k1PublicKey,
    Secp256r1: import_publickey.Secp256r1PublicKey
  };
  const PublicKey = SIGNATURE_SCHEME_TO_PUBLIC_KEY[signatureScheme];
  const signature = bytes.slice(1, bytes.length - PublicKey.SIZE);
  const pubkeyBytes = bytes.slice(1 + signature.length);
  const pubKey = new PublicKey(pubkeyBytes);
  return [
    {
      signatureScheme,
      signature,
      pubKey
    }
  ];
}
function toSingleSignaturePubkeyPair(serializedSignature) {
  const res = toParsedSignaturePubkeyPair(serializedSignature);
  if (res.length !== 1) {
    throw Error("Expected a single signature");
  }
  return res[0];
}
function publicKeyFromSerialized(schema, pubKey) {
  if (schema === "ED25519") {
    return new import_publickey3.Ed25519PublicKey(pubKey);
  }
  if (schema === "Secp256k1") {
    return new import_publickey2.Secp256k1PublicKey(pubKey);
  }
  throw new Error("Unknown public key schema");
}
function fromExportedKeypair(keypair) {
  const secretKey = (0, import_bcs.fromB64)(keypair.privateKey);
  switch (keypair.schema) {
    case "ED25519":
      let pureSecretKey = secretKey;
      if (secretKey.length === import_keypair3.LEGACY_PRIVATE_KEY_SIZE) {
        pureSecretKey = secretKey.slice(0, import_keypair3.PRIVATE_KEY_SIZE);
      }
      return import_keypair.Ed25519Keypair.fromSecretKey(pureSecretKey);
    case "Secp256k1":
      return import_keypair2.Secp256k1Keypair.fromSecretKey(secretKey);
    default:
      throw new Error(`Invalid keypair schema ${keypair.schema}`);
  }
}
//# sourceMappingURL=utils.js.map

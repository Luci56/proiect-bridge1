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
var verify_exports = {};
__export(verify_exports, {
  publicKeyFromRawBytes: () => publicKeyFromRawBytes,
  verifyPersonalMessage: () => verifyPersonalMessage,
  verifySignature: () => verifySignature,
  verifyTransactionBlock: () => verifyTransactionBlock
});
module.exports = __toCommonJS(verify_exports);
var import_cryptography = require("../cryptography/index.js");
var import_publickey = require("../keypairs/ed25519/publickey.js");
var import_publickey2 = require("../keypairs/secp256k1/publickey.js");
var import_publickey3 = require("../keypairs/secp256r1/publickey.js");
var import_publickey4 = require("../multisig/publickey.js");
async function verifySignature(bytes, signature) {
  const parsedSignature = parseSignature(signature);
  if (!await parsedSignature.publicKey.verify(bytes, parsedSignature.serializedSignature)) {
    throw new Error(`Signature is not valid for the provided data`);
  }
  return parsedSignature.publicKey;
}
async function verifyPersonalMessage(message, signature) {
  const parsedSignature = parseSignature(signature);
  if (!await parsedSignature.publicKey.verifyPersonalMessage(
    message,
    parsedSignature.serializedSignature
  )) {
    throw new Error(`Signature is not valid for the provided message`);
  }
  return parsedSignature.publicKey;
}
async function verifyTransactionBlock(transactionBlock, signature) {
  const parsedSignature = parseSignature(signature);
  if (!await parsedSignature.publicKey.verifyTransactionBlock(
    transactionBlock,
    parsedSignature.serializedSignature
  )) {
    throw new Error(`Signature is not valid for the provided TransactionBlock`);
  }
  return parsedSignature.publicKey;
}
function parseSignature(signature) {
  const parsedSignature = (0, import_cryptography.parseSerializedSignature)(signature);
  if (parsedSignature.signatureScheme === "MultiSig") {
    return {
      ...parsedSignature,
      publicKey: new import_publickey4.MultiSigPublicKey(parsedSignature.multisig.multisig_pk)
    };
  }
  const publicKey = publicKeyFromRawBytes(
    parsedSignature.signatureScheme,
    parsedSignature.publicKey
  );
  return {
    ...parsedSignature,
    publicKey
  };
}
function publicKeyFromRawBytes(signatureScheme, bytes) {
  switch (signatureScheme) {
    case "ED25519":
      return new import_publickey.Ed25519PublicKey(bytes);
    case "Secp256k1":
      return new import_publickey2.Secp256k1PublicKey(bytes);
    case "Secp256r1":
      return new import_publickey3.Secp256r1PublicKey(bytes);
    case "MultiSig":
      return new import_publickey4.MultiSigPublicKey(bytes);
    default:
      throw new Error(`Unsupported signature scheme ${signatureScheme}`);
  }
}
//# sourceMappingURL=index.js.map

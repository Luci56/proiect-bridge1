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
var keypair_exports = {};
__export(keypair_exports, {
  BaseSigner: () => BaseSigner,
  Keypair: () => Keypair,
  LEGACY_PRIVATE_KEY_SIZE: () => LEGACY_PRIVATE_KEY_SIZE,
  PRIVATE_KEY_SIZE: () => PRIVATE_KEY_SIZE
});
module.exports = __toCommonJS(keypair_exports);
var import_signature = require("./signature.js");
var import_intent = require("./intent.js");
var import_blake2b = require("@noble/hashes/blake2b");
var import_bcs = require("../bcs/index.js");
var import_bcs2 = require("@mysten/bcs");
const PRIVATE_KEY_SIZE = 32;
const LEGACY_PRIVATE_KEY_SIZE = 64;
class BaseSigner {
  async signWithIntent(bytes, intent) {
    const intentMessage = (0, import_intent.messageWithIntent)(intent, bytes);
    const digest = (0, import_blake2b.blake2b)(intentMessage, { dkLen: 32 });
    const signature = (0, import_signature.toSerializedSignature)({
      signature: await this.sign(digest),
      signatureScheme: this.getKeyScheme(),
      pubKey: this.getPublicKey()
    });
    return {
      signature,
      bytes: (0, import_bcs2.toB64)(bytes)
    };
  }
  async signTransactionBlock(bytes) {
    return this.signWithIntent(bytes, import_intent.IntentScope.TransactionData);
  }
  async signPersonalMessage(bytes) {
    return this.signWithIntent(
      import_bcs.bcs.ser(["vector", "u8"], bytes).toBytes(),
      import_intent.IntentScope.PersonalMessage
    );
  }
  /**
   * @deprecated use `signPersonalMessage` instead
   */
  async signMessage(bytes) {
    return this.signPersonalMessage(bytes);
  }
  toSuiAddress() {
    return this.getPublicKey().toSuiAddress();
  }
}
class Keypair extends BaseSigner {
}
//# sourceMappingURL=keypair.js.map

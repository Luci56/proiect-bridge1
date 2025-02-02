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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var multisig_exports = {};
__export(multisig_exports, {
  publicKeyFromSuiBytes: () => publicKeyFromSuiBytes
});
module.exports = __toCommonJS(multisig_exports);
var import_bcs = require("@mysten/bcs");
var import_verify = require("../verify/index.js");
var import_cryptography = require("../cryptography/index.js");
__reExport(multisig_exports, require("./publickey.js"), module.exports);
function publicKeyFromSuiBytes(publicKey) {
  const bytes = typeof publicKey === "string" ? (0, import_bcs.fromB64)(publicKey) : publicKey;
  const signatureScheme = import_cryptography.SIGNATURE_FLAG_TO_SCHEME[bytes[0]];
  return (0, import_verify.publicKeyFromRawBytes)(signatureScheme, bytes.slice(1));
}
//# sourceMappingURL=index.js.map

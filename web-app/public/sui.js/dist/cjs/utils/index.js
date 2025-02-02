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
  MIST_PER_SUI: () => MIST_PER_SUI,
  MOVE_STDLIB_ADDRESS: () => MOVE_STDLIB_ADDRESS,
  SUI_ADDRESS_LENGTH: () => import_sui_types.SUI_ADDRESS_LENGTH,
  SUI_CLOCK_OBJECT_ID: () => SUI_CLOCK_OBJECT_ID,
  SUI_DECIMALS: () => SUI_DECIMALS,
  SUI_FRAMEWORK_ADDRESS: () => SUI_FRAMEWORK_ADDRESS,
  SUI_SYSTEM_ADDRESS: () => SUI_SYSTEM_ADDRESS,
  SUI_SYSTEM_MODULE_NAME: () => SUI_SYSTEM_MODULE_NAME,
  SUI_SYSTEM_STATE_OBJECT_ID: () => SUI_SYSTEM_STATE_OBJECT_ID,
  SUI_TYPE_ARG: () => SUI_TYPE_ARG,
  assert: () => import_superstruct.assert,
  formatAddress: () => import_format.formatAddress,
  formatDigest: () => import_format.formatDigest,
  fromB64: () => import_bcs.fromB64,
  is: () => import_superstruct.is,
  isValidSuiAddress: () => import_sui_types.isValidSuiAddress,
  isValidSuiObjectId: () => import_sui_types.isValidSuiObjectId,
  isValidTransactionDigest: () => import_sui_types.isValidTransactionDigest,
  normalizeStructTag: () => import_sui_types.normalizeStructTag,
  normalizeSuiAddress: () => import_sui_types.normalizeSuiAddress,
  normalizeSuiObjectId: () => import_sui_types.normalizeSuiObjectId,
  parseStructTag: () => import_sui_types.parseStructTag,
  toB64: () => import_bcs.toB64
});
module.exports = __toCommonJS(utils_exports);
var import_format = require("./format.js");
var import_sui_types = require("./sui-types.js");
var import_bcs = require("@mysten/bcs");
var import_superstruct = require("superstruct");
const SUI_DECIMALS = 9;
const MIST_PER_SUI = BigInt(1e9);
const MOVE_STDLIB_ADDRESS = "0x1";
const SUI_FRAMEWORK_ADDRESS = "0x2";
const SUI_SYSTEM_ADDRESS = "0x3";
const SUI_CLOCK_OBJECT_ID = (0, import_sui_types.normalizeSuiObjectId)("0x6");
const SUI_SYSTEM_MODULE_NAME = "sui_system";
const SUI_TYPE_ARG = `${SUI_FRAMEWORK_ADDRESS}::sui::SUI`;
const SUI_SYSTEM_STATE_OBJECT_ID = (0, import_sui_types.normalizeSuiObjectId)("0x5");
//# sourceMappingURL=index.js.map

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
var common_exports = {};
__export(common_exports, {
  ObjectId: () => ObjectId,
  ObjectOwner: () => ObjectOwner,
  ProtocolConfig: () => ProtocolConfig,
  SequenceNumber: () => SequenceNumber,
  SuiAddress: () => SuiAddress,
  SuiJsonValue: () => SuiJsonValue,
  TransactionDigest: () => TransactionDigest,
  TransactionEffectsDigest: () => TransactionEffectsDigest,
  TransactionEventDigest: () => TransactionEventDigest
});
module.exports = __toCommonJS(common_exports);
var import_superstruct = require("superstruct");
const TransactionDigest = (0, import_superstruct.string)();
const TransactionEffectsDigest = (0, import_superstruct.string)();
const TransactionEventDigest = (0, import_superstruct.string)();
const ObjectId = (0, import_superstruct.string)();
const SuiAddress = (0, import_superstruct.string)();
const SequenceNumber = (0, import_superstruct.string)();
const ObjectOwner = (0, import_superstruct.union)([
  (0, import_superstruct.object)({
    AddressOwner: (0, import_superstruct.string)()
  }),
  (0, import_superstruct.object)({
    ObjectOwner: (0, import_superstruct.string)()
  }),
  (0, import_superstruct.object)({
    Shared: (0, import_superstruct.object)({
      initial_shared_version: (0, import_superstruct.nullable)((0, import_superstruct.string)())
    })
  }),
  (0, import_superstruct.literal)("Immutable")
]);
const SuiJsonValue = (0, import_superstruct.define)("SuiJsonValue", () => true);
const ProtocolConfigValue = (0, import_superstruct.union)([
  (0, import_superstruct.object)({ u32: (0, import_superstruct.string)() }),
  (0, import_superstruct.object)({ u64: (0, import_superstruct.string)() }),
  (0, import_superstruct.object)({ f64: (0, import_superstruct.string)() })
]);
const ProtocolConfig = (0, import_superstruct.object)({
  attributes: (0, import_superstruct.record)((0, import_superstruct.string)(), (0, import_superstruct.nullable)(ProtocolConfigValue)),
  featureFlags: (0, import_superstruct.record)((0, import_superstruct.string)(), (0, import_superstruct.boolean)()),
  maxSupportedProtocolVersion: (0, import_superstruct.string)(),
  minSupportedProtocolVersion: (0, import_superstruct.string)(),
  protocolVersion: (0, import_superstruct.string)()
});
//# sourceMappingURL=common.js.map

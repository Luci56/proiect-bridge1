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
var Inputs_exports = {};
__export(Inputs_exports, {
  BuilderCallArg: () => BuilderCallArg,
  Inputs: () => Inputs,
  ObjectCallArg: () => ObjectCallArg,
  PureCallArg: () => PureCallArg,
  getIdFromCallArg: () => getIdFromCallArg,
  getSharedObjectInput: () => getSharedObjectInput,
  isMutableSharedObjectInput: () => isMutableSharedObjectInput,
  isSharedObjectInput: () => isSharedObjectInput
});
module.exports = __toCommonJS(Inputs_exports);
var import_superstruct = require("superstruct");
var import_types = require("../types/index.js");
var import_bcs = require("./bcs.js");
var import_sui_types = require("../utils/sui-types.js");
const ObjectArg = (0, import_superstruct.union)([
  (0, import_superstruct.object)({ ImmOrOwned: import_types.SuiObjectRef }),
  (0, import_superstruct.object)({
    Shared: (0, import_superstruct.object)({
      objectId: (0, import_superstruct.string)(),
      initialSharedVersion: (0, import_superstruct.union)([(0, import_superstruct.integer)(), (0, import_superstruct.string)()]),
      mutable: (0, import_superstruct.boolean)()
    })
  })
]);
const PureCallArg = (0, import_superstruct.object)({ Pure: (0, import_superstruct.array)((0, import_superstruct.integer)()) });
const ObjectCallArg = (0, import_superstruct.object)({ Object: ObjectArg });
const BuilderCallArg = (0, import_superstruct.union)([PureCallArg, ObjectCallArg]);
const Inputs = {
  Pure(data, type) {
    return {
      Pure: Array.from(
        data instanceof Uint8Array ? data : (
          // NOTE: We explicitly set this to be growable to infinity, because we have maxSize validation at the builder-level:
          import_bcs.builder.ser(type, data, { maxSize: Infinity }).toBytes()
        )
      )
    };
  },
  ObjectRef({ objectId, digest, version }) {
    return {
      Object: {
        ImmOrOwned: {
          digest,
          version,
          objectId: (0, import_sui_types.normalizeSuiAddress)(objectId)
        }
      }
    };
  },
  SharedObjectRef({ objectId, mutable, initialSharedVersion }) {
    return {
      Object: {
        Shared: {
          mutable,
          initialSharedVersion,
          objectId: (0, import_sui_types.normalizeSuiAddress)(objectId)
        }
      }
    };
  }
};
function getIdFromCallArg(arg) {
  if (typeof arg === "string") {
    return (0, import_sui_types.normalizeSuiAddress)(arg);
  }
  if ("ImmOrOwned" in arg.Object) {
    return (0, import_sui_types.normalizeSuiAddress)(arg.Object.ImmOrOwned.objectId);
  }
  return (0, import_sui_types.normalizeSuiAddress)(arg.Object.Shared.objectId);
}
function getSharedObjectInput(arg) {
  return typeof arg === "object" && "Object" in arg && "Shared" in arg.Object ? arg.Object.Shared : void 0;
}
function isSharedObjectInput(arg) {
  return !!getSharedObjectInput(arg);
}
function isMutableSharedObjectInput(arg) {
  return getSharedObjectInput(arg)?.mutable ?? false;
}
//# sourceMappingURL=Inputs.js.map

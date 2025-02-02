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
var bcs_exports = {};
__export(bcs_exports, {
  bcs: () => bcs,
  isPureArg: () => isPureArg
});
module.exports = __toCommonJS(bcs_exports);
var import_bcs = require("@mysten/bcs");
function isPureArg(arg) {
  return arg.Pure !== void 0;
}
const VECTOR = "vector";
const TransactionDataV1 = {
  kind: "TransactionKind",
  sender: import_bcs.BCS.ADDRESS,
  gasData: "GasData",
  expiration: "TransactionExpiration"
};
const BCS_SPEC = {
  enums: {
    "Option<T>": {
      None: null,
      Some: "T"
    },
    ObjectArg: {
      ImmOrOwned: "SuiObjectRef",
      Shared: "SharedObjectRef"
    },
    CallArg: {
      Pure: [VECTOR, import_bcs.BCS.U8],
      Object: "ObjectArg",
      ObjVec: [VECTOR, "ObjectArg"]
    },
    TypeTag: {
      bool: null,
      u8: null,
      u64: null,
      u128: null,
      address: null,
      signer: null,
      vector: "TypeTag",
      struct: "StructTag",
      u16: null,
      u32: null,
      u256: null
    },
    TransactionKind: {
      // can not be called from sui.js; dummy placement
      // to set the enum counter right for ProgrammableTransact
      ProgrammableTransaction: "ProgrammableTransaction",
      ChangeEpoch: null,
      Genesis: null,
      ConsensusCommitPrologue: null
    },
    TransactionExpiration: {
      None: null,
      Epoch: "unsafe_u64"
    },
    TransactionData: {
      V1: "TransactionDataV1"
    }
  },
  structs: {
    SuiObjectRef: {
      objectId: import_bcs.BCS.ADDRESS,
      version: import_bcs.BCS.U64,
      digest: "ObjectDigest"
    },
    SharedObjectRef: {
      objectId: import_bcs.BCS.ADDRESS,
      initialSharedVersion: import_bcs.BCS.U64,
      mutable: import_bcs.BCS.BOOL
    },
    StructTag: {
      address: import_bcs.BCS.ADDRESS,
      module: import_bcs.BCS.STRING,
      name: import_bcs.BCS.STRING,
      typeParams: [VECTOR, "TypeTag"]
    },
    GasData: {
      payment: [VECTOR, "SuiObjectRef"],
      owner: import_bcs.BCS.ADDRESS,
      price: import_bcs.BCS.U64,
      budget: import_bcs.BCS.U64
    },
    // Signed transaction data needed to generate transaction digest.
    SenderSignedData: {
      data: "TransactionData",
      txSignatures: [VECTOR, [VECTOR, import_bcs.BCS.U8]]
    },
    TransactionDataV1
  },
  aliases: {
    ObjectDigest: import_bcs.BCS.BASE58
  }
};
const bcs = new import_bcs.BCS({ ...(0, import_bcs.getSuiMoveConfig)(), types: BCS_SPEC });
bcs.registerType(
  "utf8string",
  (writer, str) => {
    const bytes = Array.from(new TextEncoder().encode(str));
    return writer.writeVec(bytes, (writer2, el) => writer2.write8(el));
  },
  (reader) => {
    let bytes = reader.readVec((reader2) => reader2.read8());
    return new TextDecoder().decode(new Uint8Array(bytes));
  }
);
bcs.registerType(
  "unsafe_u64",
  (writer, data) => writer.write64(data),
  (reader) => Number.parseInt(reader.read64(), 10)
);
//# sourceMappingURL=index.js.map

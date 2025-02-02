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
  ARGUMENT: () => ARGUMENT,
  ARGUMENT_INNER: () => ARGUMENT_INNER,
  CALL_ARG: () => CALL_ARG,
  COMPRESSED_SIGNATURE: () => COMPRESSED_SIGNATURE,
  ENUM_KIND: () => ENUM_KIND,
  MULTISIG: () => MULTISIG,
  MULTISIG_PK_MAP: () => MULTISIG_PK_MAP,
  MULTISIG_PUBLIC_KEY: () => MULTISIG_PUBLIC_KEY,
  OBJECT_ARG: () => OBJECT_ARG,
  OPTION: () => OPTION,
  PROGRAMMABLE_CALL: () => PROGRAMMABLE_CALL,
  PROGRAMMABLE_CALL_INNER: () => PROGRAMMABLE_CALL_INNER,
  PROGRAMMABLE_TX_BLOCK: () => PROGRAMMABLE_TX_BLOCK,
  PUBLIC_KEY: () => PUBLIC_KEY,
  TRANSACTION: () => TRANSACTION,
  TRANSACTION_INNER: () => TRANSACTION_INNER,
  TYPE_TAG: () => TYPE_TAG,
  VECTOR: () => VECTOR,
  builder: () => builder
});
module.exports = __toCommonJS(bcs_exports);
var import_bcs = require("@mysten/bcs");
var import_bcs2 = require("../bcs/index.js");
var import_type_tag_serializer = require("./type-tag-serializer.js");
var import_sui_types = require("../utils/sui-types.js");
const ARGUMENT_INNER = "Argument";
const VECTOR = "vector";
const OPTION = "Option";
const CALL_ARG = "CallArg";
const TYPE_TAG = "TypeTag";
const OBJECT_ARG = "ObjectArg";
const PROGRAMMABLE_TX_BLOCK = "ProgrammableTransaction";
const PROGRAMMABLE_CALL_INNER = "ProgrammableMoveCall";
const TRANSACTION_INNER = "Transaction";
const COMPRESSED_SIGNATURE = "CompressedSignature";
const PUBLIC_KEY = "PublicKey";
const MULTISIG_PUBLIC_KEY = "MultiSigPublicKey";
const MULTISIG_PK_MAP = "MultiSigPkMap";
const MULTISIG = "MultiSig";
const ENUM_KIND = "EnumKind";
const TRANSACTION = [ENUM_KIND, TRANSACTION_INNER];
const ARGUMENT = [ENUM_KIND, ARGUMENT_INNER];
const PROGRAMMABLE_CALL = "SimpleProgrammableMoveCall";
const builder = new import_bcs.BCS(import_bcs2.bcs);
registerFixedArray(builder, "FixedArray[64]", 64);
registerFixedArray(builder, "FixedArray[33]", 33);
registerFixedArray(builder, "FixedArray[32]", 32);
builder.registerStructType(PROGRAMMABLE_TX_BLOCK, {
  inputs: [VECTOR, CALL_ARG],
  transactions: [VECTOR, TRANSACTION]
}).registerEnumType(ARGUMENT_INNER, {
  GasCoin: null,
  Input: { index: import_bcs.BCS.U16 },
  Result: { index: import_bcs.BCS.U16 },
  NestedResult: { index: import_bcs.BCS.U16, resultIndex: import_bcs.BCS.U16 }
}).registerStructType(PROGRAMMABLE_CALL_INNER, {
  package: import_bcs.BCS.ADDRESS,
  module: import_bcs.BCS.STRING,
  function: import_bcs.BCS.STRING,
  type_arguments: [VECTOR, TYPE_TAG],
  arguments: [VECTOR, ARGUMENT]
}).registerEnumType(TRANSACTION_INNER, {
  /**
   * A Move Call - any public Move function can be called via
   * this transaction. The results can be used that instant to pass
   * into the next transaction.
   */
  MoveCall: PROGRAMMABLE_CALL,
  /**
   * Transfer vector of objects to a receiver.
   */
  TransferObjects: {
    objects: [VECTOR, ARGUMENT],
    address: ARGUMENT
  },
  /**
   * Split `amount` from a `coin`.
   */
  SplitCoins: { coin: ARGUMENT, amounts: [VECTOR, ARGUMENT] },
  /**
   * Merge Vector of Coins (`sources`) into a `destination`.
   */
  MergeCoins: { destination: ARGUMENT, sources: [VECTOR, ARGUMENT] },
  /**
   * Publish a Move module.
   */
  Publish: {
    modules: [VECTOR, [VECTOR, import_bcs.BCS.U8]],
    dependencies: [VECTOR, import_bcs.BCS.ADDRESS]
  },
  /**
   * Build a vector of objects using the input arguments.
   * It is impossible to construct a `vector<T: key>` otherwise,
   * so this call serves a utility function.
   */
  MakeMoveVec: {
    type: [OPTION, TYPE_TAG],
    objects: [VECTOR, ARGUMENT]
  },
  /**  */
  Upgrade: {
    modules: [VECTOR, [VECTOR, import_bcs.BCS.U8]],
    dependencies: [VECTOR, import_bcs.BCS.ADDRESS],
    packageId: import_bcs.BCS.ADDRESS,
    ticket: ARGUMENT
  }
}).registerEnumType(COMPRESSED_SIGNATURE, {
  ED25519: ["FixedArray[64]", "u8"],
  Secp256k1: ["FixedArray[64]", "u8"],
  Secp256r1: ["FixedArray[64]", "u8"]
}).registerEnumType(PUBLIC_KEY, {
  ED25519: ["FixedArray[32]", "u8"],
  Secp256k1: ["FixedArray[33]", "u8"],
  Secp256r1: ["FixedArray[33]", "u8"]
}).registerStructType(MULTISIG_PK_MAP, {
  pubKey: PUBLIC_KEY,
  weight: import_bcs.BCS.U8
}).registerStructType(MULTISIG_PUBLIC_KEY, {
  pk_map: [VECTOR, MULTISIG_PK_MAP],
  threshold: import_bcs.BCS.U16
}).registerStructType(MULTISIG, {
  sigs: [VECTOR, COMPRESSED_SIGNATURE],
  bitmap: import_bcs.BCS.U16,
  multisig_pk: MULTISIG_PUBLIC_KEY
});
builder.registerType(
  [ENUM_KIND, "T"],
  function encode(writer, data, typeParams, typeMap) {
    const kind = data.kind;
    const invariant = { [kind]: data };
    const [enumType] = typeParams;
    return this.getTypeInterface(enumType)._encodeRaw.call(
      this,
      writer,
      invariant,
      typeParams,
      typeMap
    );
  },
  function decode(reader, typeParams, typeMap) {
    const [enumType] = typeParams;
    const data = this.getTypeInterface(enumType)._decodeRaw.call(
      this,
      reader,
      typeParams,
      typeMap
    );
    const kind = Object.keys(data)[0];
    return { kind, ...data[kind] };
  },
  (data) => {
    if (typeof data !== "object" && !("kind" in data)) {
      throw new Error(`EnumKind: Missing property "kind" in the input ${JSON.stringify(data)}`);
    }
    return true;
  }
);
builder.registerType(
  PROGRAMMABLE_CALL,
  function encodeProgrammableTx(writer, data, typeParams, typeMap) {
    const [pkg, module2, fun] = data.target.split("::");
    const type_arguments = data.typeArguments.map(
      (tag) => import_type_tag_serializer.TypeTagSerializer.parseFromStr(tag, true)
    );
    return this.getTypeInterface(PROGRAMMABLE_CALL_INNER)._encodeRaw.call(
      this,
      writer,
      {
        package: (0, import_sui_types.normalizeSuiAddress)(pkg),
        module: module2,
        function: fun,
        type_arguments,
        arguments: data.arguments
      },
      typeParams,
      typeMap
    );
  },
  function decodeProgrammableTx(reader, typeParams, typeMap) {
    let data = builder.getTypeInterface(PROGRAMMABLE_CALL_INNER)._decodeRaw.call(this, reader, typeParams, typeMap);
    return {
      target: [data.package, data.module, data.function].join("::"),
      arguments: data.arguments,
      typeArguments: data.type_arguments.map(import_type_tag_serializer.TypeTagSerializer.tagToString)
    };
  },
  // Validation callback to error out if the data format is invalid.
  // TODO: make sure TypeTag can be parsed.
  (data) => {
    return data.target.split("::").length === 3;
  }
);
function registerFixedArray(bcs2, name, length) {
  bcs2.registerType(
    name,
    function encode2(writer, data, typeParams, typeMap) {
      if (data.length !== length) {
        throw new Error(`Expected fixed array of length ${length}, got ${data.length}`);
      }
      if (typeParams.length !== 1) {
        throw new Error(`Expected one type parameter in a fixed array, got ${typeParams.length}`);
      }
      let [type] = typeof typeParams[0] === "string" ? [typeParams[0], []] : typeParams[0];
      for (let piece of data) {
        this.getTypeInterface(type)._encodeRaw.call(this, writer, piece, typeParams, typeMap);
      }
      return writer;
    },
    function decode2(reader, typeParams, typeMap) {
      if (typeParams.length !== 1) {
        throw new Error(`Expected one type parameter in a fixed array, got ${typeParams.length}`);
      }
      let result = [];
      let [type] = typeof typeParams[0] === "string" ? [typeParams[0], []] : typeParams[0];
      for (let i = 0; i < length; i++) {
        result.push(this.getTypeInterface(type)._decodeRaw.call(this, reader, typeParams, typeMap));
      }
      return result;
    }
  );
}
//# sourceMappingURL=bcs.js.map

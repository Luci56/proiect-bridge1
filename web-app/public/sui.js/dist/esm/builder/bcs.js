import { BCS } from "@mysten/bcs";
import { bcs } from "../bcs/index.js";
import { TypeTagSerializer } from "./type-tag-serializer.js";
import { normalizeSuiAddress } from "../utils/sui-types.js";
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
const builder = new BCS(bcs);
registerFixedArray(builder, "FixedArray[64]", 64);
registerFixedArray(builder, "FixedArray[33]", 33);
registerFixedArray(builder, "FixedArray[32]", 32);
builder.registerStructType(PROGRAMMABLE_TX_BLOCK, {
  inputs: [VECTOR, CALL_ARG],
  transactions: [VECTOR, TRANSACTION]
}).registerEnumType(ARGUMENT_INNER, {
  GasCoin: null,
  Input: { index: BCS.U16 },
  Result: { index: BCS.U16 },
  NestedResult: { index: BCS.U16, resultIndex: BCS.U16 }
}).registerStructType(PROGRAMMABLE_CALL_INNER, {
  package: BCS.ADDRESS,
  module: BCS.STRING,
  function: BCS.STRING,
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
    modules: [VECTOR, [VECTOR, BCS.U8]],
    dependencies: [VECTOR, BCS.ADDRESS]
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
    modules: [VECTOR, [VECTOR, BCS.U8]],
    dependencies: [VECTOR, BCS.ADDRESS],
    packageId: BCS.ADDRESS,
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
  weight: BCS.U8
}).registerStructType(MULTISIG_PUBLIC_KEY, {
  pk_map: [VECTOR, MULTISIG_PK_MAP],
  threshold: BCS.U16
}).registerStructType(MULTISIG, {
  sigs: [VECTOR, COMPRESSED_SIGNATURE],
  bitmap: BCS.U16,
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
    const [pkg, module, fun] = data.target.split("::");
    const type_arguments = data.typeArguments.map(
      (tag) => TypeTagSerializer.parseFromStr(tag, true)
    );
    return this.getTypeInterface(PROGRAMMABLE_CALL_INNER)._encodeRaw.call(
      this,
      writer,
      {
        package: normalizeSuiAddress(pkg),
        module,
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
      typeArguments: data.type_arguments.map(TypeTagSerializer.tagToString)
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
export {
  ARGUMENT,
  ARGUMENT_INNER,
  CALL_ARG,
  COMPRESSED_SIGNATURE,
  ENUM_KIND,
  MULTISIG,
  MULTISIG_PK_MAP,
  MULTISIG_PUBLIC_KEY,
  OBJECT_ARG,
  OPTION,
  PROGRAMMABLE_CALL,
  PROGRAMMABLE_CALL_INNER,
  PROGRAMMABLE_TX_BLOCK,
  PUBLIC_KEY,
  TRANSACTION,
  TRANSACTION_INNER,
  TYPE_TAG,
  VECTOR,
  builder
};
//# sourceMappingURL=bcs.js.map

import { BCS, getSuiMoveConfig } from "@mysten/bcs";
function isPureArg(arg) {
  return arg.Pure !== void 0;
}
const VECTOR = "vector";
const TransactionDataV1 = {
  kind: "TransactionKind",
  sender: BCS.ADDRESS,
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
      Pure: [VECTOR, BCS.U8],
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
      objectId: BCS.ADDRESS,
      version: BCS.U64,
      digest: "ObjectDigest"
    },
    SharedObjectRef: {
      objectId: BCS.ADDRESS,
      initialSharedVersion: BCS.U64,
      mutable: BCS.BOOL
    },
    StructTag: {
      address: BCS.ADDRESS,
      module: BCS.STRING,
      name: BCS.STRING,
      typeParams: [VECTOR, "TypeTag"]
    },
    GasData: {
      payment: [VECTOR, "SuiObjectRef"],
      owner: BCS.ADDRESS,
      price: BCS.U64,
      budget: BCS.U64
    },
    // Signed transaction data needed to generate transaction digest.
    SenderSignedData: {
      data: "TransactionData",
      txSignatures: [VECTOR, [VECTOR, BCS.U8]]
    },
    TransactionDataV1
  },
  aliases: {
    ObjectDigest: BCS.BASE58
  }
};
const bcs = new BCS({ ...getSuiMoveConfig(), types: BCS_SPEC });
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
export {
  bcs,
  isPureArg
};
//# sourceMappingURL=index.js.map

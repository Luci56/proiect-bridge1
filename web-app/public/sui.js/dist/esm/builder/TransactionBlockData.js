import { toB58 } from "@mysten/bcs";
import {
  array,
  assert,
  define,
  integer,
  is,
  literal,
  nullable,
  object,
  optional,
  string,
  union
} from "superstruct";
import { hashTypedData } from "./hash.js";
import { SuiObjectRef } from "../types/index.js";
import { builder } from "./bcs.js";
import { TransactionType, TransactionBlockInput } from "./Transactions.js";
import { BuilderCallArg, PureCallArg } from "./Inputs.js";
import { create } from "./utils.js";
import { normalizeSuiAddress } from "../utils/sui-types.js";
const TransactionExpiration = optional(
  nullable(
    union([object({ Epoch: integer() }), object({ None: union([literal(true), literal(null)]) })])
  )
);
const StringEncodedBigint = define("StringEncodedBigint", (val) => {
  if (!["string", "number", "bigint"].includes(typeof val))
    return false;
  try {
    BigInt(val);
    return true;
  } catch {
    return false;
  }
});
const GasConfig = object({
  budget: optional(StringEncodedBigint),
  price: optional(StringEncodedBigint),
  payment: optional(array(SuiObjectRef)),
  owner: optional(string())
});
const SerializedTransactionDataBuilder = object({
  version: literal(1),
  sender: optional(string()),
  expiration: TransactionExpiration,
  gasConfig: GasConfig,
  inputs: array(TransactionBlockInput),
  transactions: array(TransactionType)
});
function prepareSuiAddress(address) {
  return normalizeSuiAddress(address).replace("0x", "");
}
class TransactionBlockDataBuilder {
  constructor(clone) {
    this.version = 1;
    this.sender = clone?.sender;
    this.expiration = clone?.expiration;
    this.gasConfig = clone?.gasConfig ?? {};
    this.inputs = clone?.inputs ?? [];
    this.transactions = clone?.transactions ?? [];
  }
  static fromKindBytes(bytes) {
    const kind = builder.de("TransactionKind", bytes);
    const programmableTx = kind?.ProgrammableTransaction;
    if (!programmableTx) {
      throw new Error("Unable to deserialize from bytes.");
    }
    const serialized = create(
      {
        version: 1,
        gasConfig: {},
        inputs: programmableTx.inputs.map(
          (value, index) => create(
            {
              kind: "Input",
              value,
              index,
              type: is(value, PureCallArg) ? "pure" : "object"
            },
            TransactionBlockInput
          )
        ),
        transactions: programmableTx.transactions
      },
      SerializedTransactionDataBuilder
    );
    return TransactionBlockDataBuilder.restore(serialized);
  }
  static fromBytes(bytes) {
    const rawData = builder.de("TransactionData", bytes);
    const data = rawData?.V1;
    const programmableTx = data?.kind?.ProgrammableTransaction;
    if (!data || !programmableTx) {
      throw new Error("Unable to deserialize from bytes.");
    }
    const serialized = create(
      {
        version: 1,
        sender: data.sender,
        expiration: data.expiration,
        gasConfig: data.gasData,
        inputs: programmableTx.inputs.map(
          (value, index) => create(
            {
              kind: "Input",
              value,
              index,
              type: is(value, PureCallArg) ? "pure" : "object"
            },
            TransactionBlockInput
          )
        ),
        transactions: programmableTx.transactions
      },
      SerializedTransactionDataBuilder
    );
    return TransactionBlockDataBuilder.restore(serialized);
  }
  static restore(data) {
    assert(data, SerializedTransactionDataBuilder);
    const transactionData = new TransactionBlockDataBuilder();
    Object.assign(transactionData, data);
    return transactionData;
  }
  /**
   * Generate transaction digest.
   *
   * @param bytes BCS serialized transaction data
   * @returns transaction digest.
   */
  static getDigestFromBytes(bytes) {
    const hash = hashTypedData("TransactionData", bytes);
    return toB58(hash);
  }
  build({
    maxSizeBytes = Infinity,
    overrides,
    onlyTransactionKind
  } = {}) {
    const inputs = this.inputs.map((input) => {
      assert(input.value, BuilderCallArg);
      return input.value;
    });
    const kind = {
      ProgrammableTransaction: {
        inputs,
        transactions: this.transactions
      }
    };
    if (onlyTransactionKind) {
      return builder.ser("TransactionKind", kind, { maxSize: maxSizeBytes }).toBytes();
    }
    const expiration = overrides?.expiration ?? this.expiration;
    const sender = overrides?.sender ?? this.sender;
    const gasConfig = { ...this.gasConfig, ...overrides?.gasConfig };
    if (!sender) {
      throw new Error("Missing transaction sender");
    }
    if (!gasConfig.budget) {
      throw new Error("Missing gas budget");
    }
    if (!gasConfig.payment) {
      throw new Error("Missing gas payment");
    }
    if (!gasConfig.price) {
      throw new Error("Missing gas price");
    }
    const transactionData = {
      sender: prepareSuiAddress(sender),
      expiration: expiration ? expiration : { None: true },
      gasData: {
        payment: gasConfig.payment,
        owner: prepareSuiAddress(this.gasConfig.owner ?? sender),
        price: BigInt(gasConfig.price),
        budget: BigInt(gasConfig.budget)
      },
      kind: {
        ProgrammableTransaction: {
          inputs,
          transactions: this.transactions
        }
      }
    };
    return builder.ser("TransactionData", { V1: transactionData }, { maxSize: maxSizeBytes }).toBytes();
  }
  getDigest() {
    const bytes = this.build({ onlyTransactionKind: false });
    return TransactionBlockDataBuilder.getDigestFromBytes(bytes);
  }
  snapshot() {
    return create(this, SerializedTransactionDataBuilder);
  }
}
export {
  SerializedTransactionDataBuilder,
  TransactionBlockDataBuilder,
  TransactionExpiration
};
//# sourceMappingURL=TransactionBlockData.js.map

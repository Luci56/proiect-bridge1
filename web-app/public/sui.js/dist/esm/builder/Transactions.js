import { BCS, fromB64 } from "@mysten/bcs";
import {
  is,
  any,
  array,
  integer,
  literal,
  object,
  optional,
  string,
  union,
  assert,
  define,
  unknown,
  record
} from "superstruct";
import { TRANSACTION_TYPE, create } from "./utils.js";
import { TypeTagSerializer } from "./type-tag-serializer.js";
import { normalizeSuiObjectId } from "../utils/sui-types.js";
const option = (some) => union([object({ None: union([literal(true), literal(null)]) }), object({ Some: some })]);
const TransactionBlockInput = object({
  kind: literal("Input"),
  index: integer(),
  value: optional(any()),
  type: optional(union([literal("pure"), literal("object")]))
});
const TransactionArgumentTypes = [
  TransactionBlockInput,
  object({ kind: literal("GasCoin") }),
  object({ kind: literal("Result"), index: integer() }),
  object({
    kind: literal("NestedResult"),
    index: integer(),
    resultIndex: integer()
  })
];
const TransactionArgument = union([...TransactionArgumentTypes]);
const ObjectTransactionArgument = union([...TransactionArgumentTypes]);
ObjectTransactionArgument[TRANSACTION_TYPE] = {
  kind: "object"
};
const PureTransactionArgument = (type) => {
  const struct = union([...TransactionArgumentTypes]);
  struct[TRANSACTION_TYPE] = {
    kind: "pure",
    type
  };
  return struct;
};
const MoveCallTransaction = object({
  kind: literal("MoveCall"),
  target: define("target", string().validator),
  typeArguments: array(string()),
  arguments: array(TransactionArgument)
});
const TransferObjectsTransaction = object({
  kind: literal("TransferObjects"),
  objects: array(ObjectTransactionArgument),
  address: PureTransactionArgument(BCS.ADDRESS)
});
const SplitCoinsTransaction = object({
  kind: literal("SplitCoins"),
  coin: ObjectTransactionArgument,
  amounts: array(PureTransactionArgument("u64"))
});
const MergeCoinsTransaction = object({
  kind: literal("MergeCoins"),
  destination: ObjectTransactionArgument,
  sources: array(ObjectTransactionArgument)
});
const MakeMoveVecTransaction = object({
  kind: literal("MakeMoveVec"),
  // TODO: ideally we should use `TypeTag` instead of `record()` here,
  // but TypeTag is recursively defined and it's tricky to define a
  // recursive struct in superstruct
  type: optional(option(record(string(), unknown()))),
  objects: array(ObjectTransactionArgument)
});
const PublishTransaction = object({
  kind: literal("Publish"),
  modules: array(array(integer())),
  dependencies: array(string())
});
var UpgradePolicy = /* @__PURE__ */ ((UpgradePolicy2) => {
  UpgradePolicy2[UpgradePolicy2["COMPATIBLE"] = 0] = "COMPATIBLE";
  UpgradePolicy2[UpgradePolicy2["ADDITIVE"] = 128] = "ADDITIVE";
  UpgradePolicy2[UpgradePolicy2["DEP_ONLY"] = 192] = "DEP_ONLY";
  return UpgradePolicy2;
})(UpgradePolicy || {});
const UpgradeTransaction = object({
  kind: literal("Upgrade"),
  modules: array(array(integer())),
  dependencies: array(string()),
  packageId: string(),
  ticket: ObjectTransactionArgument
});
const TransactionTypes = [
  MoveCallTransaction,
  TransferObjectsTransaction,
  SplitCoinsTransaction,
  MergeCoinsTransaction,
  PublishTransaction,
  UpgradeTransaction,
  MakeMoveVecTransaction
];
const TransactionType = union([...TransactionTypes]);
function getTransactionType(data) {
  assert(data, TransactionType);
  return TransactionTypes.find((schema) => is(data, schema));
}
const Transactions = {
  MoveCall(input) {
    return create(
      {
        kind: "MoveCall",
        target: input.target,
        arguments: input.arguments ?? [],
        typeArguments: input.typeArguments ?? []
      },
      MoveCallTransaction
    );
  },
  TransferObjects(objects, address) {
    return create({ kind: "TransferObjects", objects, address }, TransferObjectsTransaction);
  },
  SplitCoins(coin, amounts) {
    return create({ kind: "SplitCoins", coin, amounts }, SplitCoinsTransaction);
  },
  MergeCoins(destination, sources) {
    return create({ kind: "MergeCoins", destination, sources }, MergeCoinsTransaction);
  },
  Publish({
    modules,
    dependencies
  }) {
    return create(
      {
        kind: "Publish",
        modules: modules.map(
          (module) => typeof module === "string" ? Array.from(fromB64(module)) : module
        ),
        dependencies: dependencies.map((dep) => normalizeSuiObjectId(dep))
      },
      PublishTransaction
    );
  },
  Upgrade({
    modules,
    dependencies,
    packageId,
    ticket
  }) {
    return create(
      {
        kind: "Upgrade",
        modules: modules.map(
          (module) => typeof module === "string" ? Array.from(fromB64(module)) : module
        ),
        dependencies: dependencies.map((dep) => normalizeSuiObjectId(dep)),
        packageId,
        ticket
      },
      UpgradeTransaction
    );
  },
  MakeMoveVec({
    type,
    objects
  }) {
    return create(
      {
        kind: "MakeMoveVec",
        type: type ? { Some: TypeTagSerializer.parseFromStr(type) } : { None: null },
        objects
      },
      MakeMoveVecTransaction
    );
  }
};
export {
  MakeMoveVecTransaction,
  MergeCoinsTransaction,
  MoveCallTransaction,
  ObjectTransactionArgument,
  PublishTransaction,
  PureTransactionArgument,
  SplitCoinsTransaction,
  TransactionArgument,
  TransactionBlockInput,
  TransactionType,
  Transactions,
  TransferObjectsTransaction,
  UpgradePolicy,
  UpgradeTransaction,
  getTransactionType
};
//# sourceMappingURL=Transactions.js.map

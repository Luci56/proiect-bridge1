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
var objects_exports = {};
__export(objects_exports, {
  CheckpointedObjectId: () => CheckpointedObjectId,
  DisplayFieldsBackwardCompatibleResponse: () => DisplayFieldsBackwardCompatibleResponse,
  DisplayFieldsResponse: () => DisplayFieldsResponse,
  GetOwnedObjectsResponse: () => GetOwnedObjectsResponse,
  MIST_PER_SUI: () => MIST_PER_SUI,
  MovePackageContent: () => MovePackageContent,
  ObjectContentFields: () => ObjectContentFields,
  ObjectDigest: () => ObjectDigest,
  ObjectRead: () => ObjectRead,
  ObjectStatus: () => ObjectStatus,
  ObjectType: () => ObjectType,
  PaginatedObjectsResponse: () => PaginatedObjectsResponse,
  SUI_DECIMALS: () => SUI_DECIMALS,
  SuiGasData: () => SuiGasData,
  SuiMoveObject: () => SuiMoveObject,
  SuiMovePackage: () => SuiMovePackage,
  SuiObjectData: () => SuiObjectData,
  SuiObjectDataOptions: () => SuiObjectDataOptions,
  SuiObjectInfo: () => SuiObjectInfo,
  SuiObjectRef: () => SuiObjectRef,
  SuiObjectResponse: () => SuiObjectResponse,
  SuiObjectResponseError: () => SuiObjectResponseError,
  SuiParsedData: () => SuiParsedData,
  SuiRawData: () => SuiRawData,
  SuiRawMoveObject: () => SuiRawMoveObject,
  SuiRawMovePackage: () => SuiRawMovePackage,
  getMoveObject: () => getMoveObject,
  getMoveObjectType: () => getMoveObjectType,
  getMovePackageContent: () => getMovePackageContent,
  getObjectDeletedResponse: () => getObjectDeletedResponse,
  getObjectDisplay: () => getObjectDisplay,
  getObjectFields: () => getObjectFields,
  getObjectId: () => getObjectId,
  getObjectNotExistsResponse: () => getObjectNotExistsResponse,
  getObjectOwner: () => getObjectOwner,
  getObjectPreviousTransactionDigest: () => getObjectPreviousTransactionDigest,
  getObjectReference: () => getObjectReference,
  getObjectType: () => getObjectType,
  getObjectVersion: () => getObjectVersion,
  getSharedObjectInitialVersion: () => getSharedObjectInitialVersion,
  getSuiObjectData: () => getSuiObjectData,
  hasPublicTransfer: () => hasPublicTransfer,
  isImmutableObject: () => isImmutableObject,
  isSharedObject: () => isSharedObject,
  isSuiObjectResponse: () => isSuiObjectResponse
});
module.exports = __toCommonJS(objects_exports);
var import_superstruct = require("superstruct");
var import_common = require("./common.js");
const ObjectType = (0, import_superstruct.union)([(0, import_superstruct.string)(), (0, import_superstruct.literal)("package")]);
const SuiObjectRef = (0, import_superstruct.object)({
  /** Base64 string representing the object digest */
  digest: (0, import_superstruct.string)(),
  /** Hex code as string representing the object id */
  objectId: (0, import_superstruct.string)(),
  /** Object version */
  version: (0, import_superstruct.union)([(0, import_superstruct.number)(), (0, import_superstruct.string)()])
});
const SuiGasData = (0, import_superstruct.object)({
  payment: (0, import_superstruct.array)(SuiObjectRef),
  /** Gas Object's owner */
  owner: (0, import_superstruct.string)(),
  price: (0, import_superstruct.string)(),
  budget: (0, import_superstruct.string)()
});
const SuiObjectInfo = (0, import_superstruct.assign)(
  SuiObjectRef,
  (0, import_superstruct.object)({
    type: (0, import_superstruct.string)(),
    owner: import_common.ObjectOwner,
    previousTransaction: (0, import_superstruct.string)()
  })
);
const ObjectContentFields = (0, import_superstruct.record)((0, import_superstruct.string)(), (0, import_superstruct.any)());
const MovePackageContent = (0, import_superstruct.record)((0, import_superstruct.string)(), (0, import_superstruct.unknown)());
const SuiMoveObject = (0, import_superstruct.object)({
  /** Move type (e.g., "0x2::coin::Coin<0x2::sui::SUI>") */
  type: (0, import_superstruct.string)(),
  /** Fields and values stored inside the Move object */
  fields: ObjectContentFields,
  hasPublicTransfer: (0, import_superstruct.boolean)()
});
const SuiMovePackage = (0, import_superstruct.object)({
  /** A mapping from module name to disassembled Move bytecode */
  disassembled: MovePackageContent
});
const SuiParsedData = (0, import_superstruct.union)([
  (0, import_superstruct.assign)(SuiMoveObject, (0, import_superstruct.object)({ dataType: (0, import_superstruct.literal)("moveObject") })),
  (0, import_superstruct.assign)(SuiMovePackage, (0, import_superstruct.object)({ dataType: (0, import_superstruct.literal)("package") }))
]);
const SuiRawMoveObject = (0, import_superstruct.object)({
  /** Move type (e.g., "0x2::coin::Coin<0x2::sui::SUI>") */
  type: (0, import_superstruct.string)(),
  hasPublicTransfer: (0, import_superstruct.boolean)(),
  version: (0, import_superstruct.string)(),
  bcsBytes: (0, import_superstruct.string)()
});
const SuiRawMovePackage = (0, import_superstruct.object)({
  id: (0, import_superstruct.string)(),
  /** A mapping from module name to Move bytecode enocded in base64*/
  moduleMap: (0, import_superstruct.record)((0, import_superstruct.string)(), (0, import_superstruct.string)())
});
const SuiRawData = (0, import_superstruct.union)([
  (0, import_superstruct.assign)(SuiRawMoveObject, (0, import_superstruct.object)({ dataType: (0, import_superstruct.literal)("moveObject") })),
  (0, import_superstruct.assign)(SuiRawMovePackage, (0, import_superstruct.object)({ dataType: (0, import_superstruct.literal)("package") }))
]);
const SUI_DECIMALS = 9;
const MIST_PER_SUI = BigInt(1e9);
const ObjectDigest = (0, import_superstruct.string)();
const SuiObjectResponseError = (0, import_superstruct.object)({
  code: (0, import_superstruct.string)(),
  error: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  object_id: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  parent_object_id: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  version: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  digest: (0, import_superstruct.optional)((0, import_superstruct.string)())
});
const DisplayFieldsResponse = (0, import_superstruct.object)({
  data: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.record)((0, import_superstruct.string)(), (0, import_superstruct.string)()))),
  error: (0, import_superstruct.nullable)((0, import_superstruct.optional)(SuiObjectResponseError))
});
const DisplayFieldsBackwardCompatibleResponse = (0, import_superstruct.union)([
  DisplayFieldsResponse,
  (0, import_superstruct.optional)((0, import_superstruct.record)((0, import_superstruct.string)(), (0, import_superstruct.string)()))
]);
const SuiObjectData = (0, import_superstruct.object)({
  objectId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.string)(),
  digest: (0, import_superstruct.string)(),
  /**
   * Type of the object, default to be undefined unless SuiObjectDataOptions.showType is set to true
   */
  type: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.string)())),
  /**
   * Move object content or package content, default to be undefined unless SuiObjectDataOptions.showContent is set to true
   */
  content: (0, import_superstruct.nullable)((0, import_superstruct.optional)(SuiParsedData)),
  /**
   * Move object content or package content in BCS bytes, default to be undefined unless SuiObjectDataOptions.showBcs is set to true
   */
  bcs: (0, import_superstruct.nullable)((0, import_superstruct.optional)(SuiRawData)),
  /**
   * The owner of this object. Default to be undefined unless SuiObjectDataOptions.showOwner is set to true
   */
  owner: (0, import_superstruct.nullable)((0, import_superstruct.optional)(import_common.ObjectOwner)),
  /**
   * The digest of the transaction that created or last mutated this object.
   * Default to be undefined unless SuiObjectDataOptions.showPreviousTransaction is set to true
   */
  previousTransaction: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.string)())),
  /**
   * The amount of SUI we would rebate if this object gets deleted.
   * This number is re-calculated each time the object is mutated based on
   * the present storage gas price.
   * Default to be undefined unless SuiObjectDataOptions.showStorageRebate is set to true
   */
  storageRebate: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.string)())),
  /**
   * Display metadata for this object, default to be undefined unless SuiObjectDataOptions.showDisplay is set to true
   * This can also be None if the struct type does not have Display defined
   * See more details in https://forums.sui.io/t/nft-object-display-proposal/4872
   */
  display: (0, import_superstruct.nullable)((0, import_superstruct.optional)(DisplayFieldsBackwardCompatibleResponse))
});
const SuiObjectDataOptions = (0, import_superstruct.object)({
  /* Whether to fetch the object type, default to be true */
  showType: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.boolean)())),
  /* Whether to fetch the object content, default to be false */
  showContent: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.boolean)())),
  /* Whether to fetch the object content in BCS bytes, default to be false */
  showBcs: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.boolean)())),
  /* Whether to fetch the object owner, default to be false */
  showOwner: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.boolean)())),
  /* Whether to fetch the previous transaction digest, default to be false */
  showPreviousTransaction: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.boolean)())),
  /* Whether to fetch the storage rebate, default to be false */
  showStorageRebate: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.boolean)())),
  /* Whether to fetch the display metadata, default to be false */
  showDisplay: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.boolean)()))
});
const ObjectStatus = (0, import_superstruct.union)([(0, import_superstruct.literal)("Exists"), (0, import_superstruct.literal)("notExists"), (0, import_superstruct.literal)("Deleted")]);
const GetOwnedObjectsResponse = (0, import_superstruct.array)(SuiObjectInfo);
const SuiObjectResponse = (0, import_superstruct.object)({
  data: (0, import_superstruct.nullable)((0, import_superstruct.optional)(SuiObjectData)),
  error: (0, import_superstruct.nullable)((0, import_superstruct.optional)(SuiObjectResponseError))
});
function getSuiObjectData(resp) {
  return resp.data;
}
function getObjectDeletedResponse(resp) {
  if (resp.error && "object_id" in resp.error && "version" in resp.error && "digest" in resp.error) {
    const error = resp.error;
    return {
      objectId: error.object_id,
      version: error.version,
      digest: error.digest
    };
  }
  return void 0;
}
function getObjectNotExistsResponse(resp) {
  if (resp.error && "object_id" in resp.error && !("version" in resp.error) && !("digest" in resp.error)) {
    return resp.error.object_id;
  }
  return void 0;
}
function getObjectReference(resp) {
  if ("reference" in resp) {
    return resp.reference;
  }
  const exists = getSuiObjectData(resp);
  if (exists) {
    return {
      objectId: exists.objectId,
      version: exists.version,
      digest: exists.digest
    };
  }
  return getObjectDeletedResponse(resp);
}
function getObjectId(data) {
  if ("objectId" in data) {
    return data.objectId;
  }
  return getObjectReference(data)?.objectId ?? getObjectNotExistsResponse(data);
}
function getObjectVersion(data) {
  if ("version" in data) {
    return data.version;
  }
  return getObjectReference(data)?.version;
}
function isSuiObjectResponse(resp) {
  return resp.data !== void 0;
}
function getObjectType(resp) {
  const data = isSuiObjectResponse(resp) ? resp.data : resp;
  if (!data?.type && "data" in resp) {
    if (data?.content?.dataType === "package") {
      return "package";
    }
    return getMoveObjectType(resp);
  }
  return data?.type;
}
function getObjectPreviousTransactionDigest(resp) {
  return getSuiObjectData(resp)?.previousTransaction;
}
function getObjectOwner(resp) {
  if ((0, import_superstruct.is)(resp, import_common.ObjectOwner)) {
    return resp;
  }
  return getSuiObjectData(resp)?.owner;
}
function getObjectDisplay(resp) {
  const display = getSuiObjectData(resp)?.display;
  if (!display) {
    return { data: null, error: null };
  }
  if ((0, import_superstruct.is)(display, DisplayFieldsResponse)) {
    return display;
  }
  return {
    data: display,
    error: null
  };
}
function getSharedObjectInitialVersion(resp) {
  const owner = getObjectOwner(resp);
  if (owner && typeof owner === "object" && "Shared" in owner) {
    return owner.Shared.initial_shared_version;
  } else {
    return void 0;
  }
}
function isSharedObject(resp) {
  const owner = getObjectOwner(resp);
  return !!owner && typeof owner === "object" && "Shared" in owner;
}
function isImmutableObject(resp) {
  const owner = getObjectOwner(resp);
  return owner === "Immutable";
}
function getMoveObjectType(resp) {
  return getMoveObject(resp)?.type;
}
function getObjectFields(resp) {
  if ("fields" in resp) {
    return resp.fields;
  }
  return getMoveObject(resp)?.fields;
}
function isSuiObjectDataWithContent(data) {
  return data.content !== void 0;
}
function getMoveObject(data) {
  const suiObject = "data" in data ? getSuiObjectData(data) : data;
  if (!suiObject || !isSuiObjectDataWithContent(suiObject) || suiObject.content.dataType !== "moveObject") {
    return void 0;
  }
  return suiObject.content;
}
function hasPublicTransfer(data) {
  return getMoveObject(data)?.hasPublicTransfer ?? false;
}
function getMovePackageContent(data) {
  if ("disassembled" in data) {
    return data.disassembled;
  }
  const suiObject = getSuiObjectData(data);
  if (suiObject?.content?.dataType !== "package") {
    return void 0;
  }
  return suiObject.content.disassembled;
}
const CheckpointedObjectId = (0, import_superstruct.object)({
  objectId: (0, import_superstruct.string)(),
  atCheckpoint: (0, import_superstruct.optional)((0, import_superstruct.number)())
});
const PaginatedObjectsResponse = (0, import_superstruct.object)({
  data: (0, import_superstruct.array)(SuiObjectResponse),
  nextCursor: (0, import_superstruct.optional)((0, import_superstruct.nullable)((0, import_superstruct.string)())),
  hasNextPage: (0, import_superstruct.boolean)()
});
const ObjectRead = (0, import_superstruct.union)([
  (0, import_superstruct.object)({
    details: SuiObjectData,
    status: (0, import_superstruct.literal)("VersionFound")
  }),
  (0, import_superstruct.object)({
    details: (0, import_superstruct.string)(),
    status: (0, import_superstruct.literal)("ObjectNotExists")
  }),
  (0, import_superstruct.object)({
    details: SuiObjectRef,
    status: (0, import_superstruct.literal)("ObjectDeleted")
  }),
  (0, import_superstruct.object)({
    details: (0, import_superstruct.tuple)([(0, import_superstruct.string)(), (0, import_superstruct.number)()]),
    status: (0, import_superstruct.literal)("VersionNotFound")
  }),
  (0, import_superstruct.object)({
    details: (0, import_superstruct.object)({
      asked_version: (0, import_superstruct.number)(),
      latest_version: (0, import_superstruct.number)(),
      object_id: (0, import_superstruct.string)()
    }),
    status: (0, import_superstruct.literal)("VersionTooHigh")
  })
]);
//# sourceMappingURL=objects.js.map

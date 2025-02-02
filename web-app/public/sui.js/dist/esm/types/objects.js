import {
  any,
  array,
  assign,
  boolean,
  literal,
  number,
  object,
  optional,
  record,
  string,
  union,
  is,
  nullable,
  tuple,
  unknown
} from "superstruct";
import { ObjectOwner } from "./common.js";
const ObjectType = union([string(), literal("package")]);
const SuiObjectRef = object({
  /** Base64 string representing the object digest */
  digest: string(),
  /** Hex code as string representing the object id */
  objectId: string(),
  /** Object version */
  version: union([number(), string()])
});
const SuiGasData = object({
  payment: array(SuiObjectRef),
  /** Gas Object's owner */
  owner: string(),
  price: string(),
  budget: string()
});
const SuiObjectInfo = assign(
  SuiObjectRef,
  object({
    type: string(),
    owner: ObjectOwner,
    previousTransaction: string()
  })
);
const ObjectContentFields = record(string(), any());
const MovePackageContent = record(string(), unknown());
const SuiMoveObject = object({
  /** Move type (e.g., "0x2::coin::Coin<0x2::sui::SUI>") */
  type: string(),
  /** Fields and values stored inside the Move object */
  fields: ObjectContentFields,
  hasPublicTransfer: boolean()
});
const SuiMovePackage = object({
  /** A mapping from module name to disassembled Move bytecode */
  disassembled: MovePackageContent
});
const SuiParsedData = union([
  assign(SuiMoveObject, object({ dataType: literal("moveObject") })),
  assign(SuiMovePackage, object({ dataType: literal("package") }))
]);
const SuiRawMoveObject = object({
  /** Move type (e.g., "0x2::coin::Coin<0x2::sui::SUI>") */
  type: string(),
  hasPublicTransfer: boolean(),
  version: string(),
  bcsBytes: string()
});
const SuiRawMovePackage = object({
  id: string(),
  /** A mapping from module name to Move bytecode enocded in base64*/
  moduleMap: record(string(), string())
});
const SuiRawData = union([
  assign(SuiRawMoveObject, object({ dataType: literal("moveObject") })),
  assign(SuiRawMovePackage, object({ dataType: literal("package") }))
]);
const SUI_DECIMALS = 9;
const MIST_PER_SUI = BigInt(1e9);
const ObjectDigest = string();
const SuiObjectResponseError = object({
  code: string(),
  error: optional(string()),
  object_id: optional(string()),
  parent_object_id: optional(string()),
  version: optional(string()),
  digest: optional(string())
});
const DisplayFieldsResponse = object({
  data: nullable(optional(record(string(), string()))),
  error: nullable(optional(SuiObjectResponseError))
});
const DisplayFieldsBackwardCompatibleResponse = union([
  DisplayFieldsResponse,
  optional(record(string(), string()))
]);
const SuiObjectData = object({
  objectId: string(),
  version: string(),
  digest: string(),
  /**
   * Type of the object, default to be undefined unless SuiObjectDataOptions.showType is set to true
   */
  type: nullable(optional(string())),
  /**
   * Move object content or package content, default to be undefined unless SuiObjectDataOptions.showContent is set to true
   */
  content: nullable(optional(SuiParsedData)),
  /**
   * Move object content or package content in BCS bytes, default to be undefined unless SuiObjectDataOptions.showBcs is set to true
   */
  bcs: nullable(optional(SuiRawData)),
  /**
   * The owner of this object. Default to be undefined unless SuiObjectDataOptions.showOwner is set to true
   */
  owner: nullable(optional(ObjectOwner)),
  /**
   * The digest of the transaction that created or last mutated this object.
   * Default to be undefined unless SuiObjectDataOptions.showPreviousTransaction is set to true
   */
  previousTransaction: nullable(optional(string())),
  /**
   * The amount of SUI we would rebate if this object gets deleted.
   * This number is re-calculated each time the object is mutated based on
   * the present storage gas price.
   * Default to be undefined unless SuiObjectDataOptions.showStorageRebate is set to true
   */
  storageRebate: nullable(optional(string())),
  /**
   * Display metadata for this object, default to be undefined unless SuiObjectDataOptions.showDisplay is set to true
   * This can also be None if the struct type does not have Display defined
   * See more details in https://forums.sui.io/t/nft-object-display-proposal/4872
   */
  display: nullable(optional(DisplayFieldsBackwardCompatibleResponse))
});
const SuiObjectDataOptions = object({
  /* Whether to fetch the object type, default to be true */
  showType: nullable(optional(boolean())),
  /* Whether to fetch the object content, default to be false */
  showContent: nullable(optional(boolean())),
  /* Whether to fetch the object content in BCS bytes, default to be false */
  showBcs: nullable(optional(boolean())),
  /* Whether to fetch the object owner, default to be false */
  showOwner: nullable(optional(boolean())),
  /* Whether to fetch the previous transaction digest, default to be false */
  showPreviousTransaction: nullable(optional(boolean())),
  /* Whether to fetch the storage rebate, default to be false */
  showStorageRebate: nullable(optional(boolean())),
  /* Whether to fetch the display metadata, default to be false */
  showDisplay: nullable(optional(boolean()))
});
const ObjectStatus = union([literal("Exists"), literal("notExists"), literal("Deleted")]);
const GetOwnedObjectsResponse = array(SuiObjectInfo);
const SuiObjectResponse = object({
  data: nullable(optional(SuiObjectData)),
  error: nullable(optional(SuiObjectResponseError))
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
  if (is(resp, ObjectOwner)) {
    return resp;
  }
  return getSuiObjectData(resp)?.owner;
}
function getObjectDisplay(resp) {
  const display = getSuiObjectData(resp)?.display;
  if (!display) {
    return { data: null, error: null };
  }
  if (is(display, DisplayFieldsResponse)) {
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
const CheckpointedObjectId = object({
  objectId: string(),
  atCheckpoint: optional(number())
});
const PaginatedObjectsResponse = object({
  data: array(SuiObjectResponse),
  nextCursor: optional(nullable(string())),
  hasNextPage: boolean()
});
const ObjectRead = union([
  object({
    details: SuiObjectData,
    status: literal("VersionFound")
  }),
  object({
    details: string(),
    status: literal("ObjectNotExists")
  }),
  object({
    details: SuiObjectRef,
    status: literal("ObjectDeleted")
  }),
  object({
    details: tuple([string(), number()]),
    status: literal("VersionNotFound")
  }),
  object({
    details: object({
      asked_version: number(),
      latest_version: number(),
      object_id: string()
    }),
    status: literal("VersionTooHigh")
  })
]);
export {
  CheckpointedObjectId,
  DisplayFieldsBackwardCompatibleResponse,
  DisplayFieldsResponse,
  GetOwnedObjectsResponse,
  MIST_PER_SUI,
  MovePackageContent,
  ObjectContentFields,
  ObjectDigest,
  ObjectRead,
  ObjectStatus,
  ObjectType,
  PaginatedObjectsResponse,
  SUI_DECIMALS,
  SuiGasData,
  SuiMoveObject,
  SuiMovePackage,
  SuiObjectData,
  SuiObjectDataOptions,
  SuiObjectInfo,
  SuiObjectRef,
  SuiObjectResponse,
  SuiObjectResponseError,
  SuiParsedData,
  SuiRawData,
  SuiRawMoveObject,
  SuiRawMovePackage,
  getMoveObject,
  getMoveObjectType,
  getMovePackageContent,
  getObjectDeletedResponse,
  getObjectDisplay,
  getObjectFields,
  getObjectId,
  getObjectNotExistsResponse,
  getObjectOwner,
  getObjectPreviousTransactionDigest,
  getObjectReference,
  getObjectType,
  getObjectVersion,
  getSharedObjectInitialVersion,
  getSuiObjectData,
  hasPublicTransfer,
  isImmutableObject,
  isSharedObject,
  isSuiObjectResponse
};
//# sourceMappingURL=objects.js.map

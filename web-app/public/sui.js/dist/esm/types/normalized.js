import {
  array,
  object,
  string,
  union,
  boolean,
  define,
  number,
  literal,
  record,
  is,
  tuple
} from "superstruct";
const SuiMoveFunctionArgType = union([string(), object({ Object: string() })]);
const SuiMoveFunctionArgTypes = array(SuiMoveFunctionArgType);
const SuiMoveModuleId = object({
  address: string(),
  name: string()
});
const SuiMoveVisibility = union([literal("Private"), literal("Public"), literal("Friend")]);
const SuiMoveAbilitySet = object({
  abilities: array(string())
});
const SuiMoveStructTypeParameter = object({
  constraints: SuiMoveAbilitySet,
  isPhantom: boolean()
});
const SuiMoveNormalizedTypeParameterType = object({
  TypeParameter: number()
});
const MoveCallMetric = tuple([
  object({
    module: string(),
    package: string(),
    function: string()
  }),
  string()
]);
const MoveCallMetrics = object({
  rank3Days: array(MoveCallMetric),
  rank7Days: array(MoveCallMetric),
  rank30Days: array(MoveCallMetric)
});
function isSuiMoveNormalizedType(value) {
  if (!value)
    return false;
  if (typeof value === "string")
    return true;
  if (is(value, SuiMoveNormalizedTypeParameterType))
    return true;
  if (isSuiMoveNormalizedStructType(value))
    return true;
  if (typeof value !== "object")
    return false;
  const valueProperties = value;
  if (is(valueProperties.Reference, SuiMoveNormalizedType))
    return true;
  if (is(valueProperties.MutableReference, SuiMoveNormalizedType))
    return true;
  if (is(valueProperties.Vector, SuiMoveNormalizedType))
    return true;
  return false;
}
const SuiMoveNormalizedType = define(
  "SuiMoveNormalizedType",
  isSuiMoveNormalizedType
);
function isSuiMoveNormalizedStructType(value) {
  if (!value || typeof value !== "object")
    return false;
  const valueProperties = value;
  if (!valueProperties.Struct || typeof valueProperties.Struct !== "object")
    return false;
  const structProperties = valueProperties.Struct;
  if (typeof structProperties.address !== "string" || typeof structProperties.module !== "string" || typeof structProperties.name !== "string" || !Array.isArray(structProperties.typeArguments) || !structProperties.typeArguments.every((value2) => isSuiMoveNormalizedType(value2))) {
    return false;
  }
  return true;
}
const SuiMoveNormalizedStructType = define(
  "SuiMoveNormalizedStructType",
  isSuiMoveNormalizedStructType
);
const SuiMoveNormalizedFunction = object({
  visibility: SuiMoveVisibility,
  isEntry: boolean(),
  typeParameters: array(SuiMoveAbilitySet),
  parameters: array(SuiMoveNormalizedType),
  return: array(SuiMoveNormalizedType)
});
const SuiMoveNormalizedField = object({
  name: string(),
  type: SuiMoveNormalizedType
});
const SuiMoveNormalizedStruct = object({
  abilities: SuiMoveAbilitySet,
  typeParameters: array(SuiMoveStructTypeParameter),
  fields: array(SuiMoveNormalizedField)
});
const SuiMoveNormalizedModule = object({
  fileFormatVersion: number(),
  address: string(),
  name: string(),
  friends: array(SuiMoveModuleId),
  structs: record(string(), SuiMoveNormalizedStruct),
  exposedFunctions: record(string(), SuiMoveNormalizedFunction)
});
const SuiMoveNormalizedModules = record(string(), SuiMoveNormalizedModule);
function extractMutableReference(normalizedType) {
  return typeof normalizedType === "object" && "MutableReference" in normalizedType ? normalizedType.MutableReference : void 0;
}
function extractReference(normalizedType) {
  return typeof normalizedType === "object" && "Reference" in normalizedType ? normalizedType.Reference : void 0;
}
function extractStructTag(normalizedType) {
  if (typeof normalizedType === "object" && "Struct" in normalizedType) {
    return normalizedType;
  }
  const ref = extractReference(normalizedType);
  const mutRef = extractMutableReference(normalizedType);
  if (typeof ref === "object" && "Struct" in ref) {
    return ref;
  }
  if (typeof mutRef === "object" && "Struct" in mutRef) {
    return mutRef;
  }
  return void 0;
}
export {
  MoveCallMetric,
  MoveCallMetrics,
  SuiMoveAbilitySet,
  SuiMoveFunctionArgType,
  SuiMoveFunctionArgTypes,
  SuiMoveModuleId,
  SuiMoveNormalizedField,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedModule,
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedStructType,
  SuiMoveNormalizedType,
  SuiMoveNormalizedTypeParameterType,
  SuiMoveStructTypeParameter,
  SuiMoveVisibility,
  extractMutableReference,
  extractReference,
  extractStructTag
};
//# sourceMappingURL=normalized.js.map

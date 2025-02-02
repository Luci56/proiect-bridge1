import { formatAddress, formatDigest } from "./format.js";
import {
  isValidSuiAddress,
  isValidSuiObjectId,
  isValidTransactionDigest,
  normalizeStructTag,
  normalizeSuiAddress,
  normalizeSuiObjectId,
  parseStructTag,
  SUI_ADDRESS_LENGTH
} from "./sui-types.js";
import { fromB64, toB64 } from "@mysten/bcs";
import { is, assert } from "superstruct";
const SUI_DECIMALS = 9;
const MIST_PER_SUI = BigInt(1e9);
const MOVE_STDLIB_ADDRESS = "0x1";
const SUI_FRAMEWORK_ADDRESS = "0x2";
const SUI_SYSTEM_ADDRESS = "0x3";
const SUI_CLOCK_OBJECT_ID = normalizeSuiObjectId("0x6");
const SUI_SYSTEM_MODULE_NAME = "sui_system";
const SUI_TYPE_ARG = `${SUI_FRAMEWORK_ADDRESS}::sui::SUI`;
const SUI_SYSTEM_STATE_OBJECT_ID = normalizeSuiObjectId("0x5");
export {
  MIST_PER_SUI,
  MOVE_STDLIB_ADDRESS,
  SUI_ADDRESS_LENGTH,
  SUI_CLOCK_OBJECT_ID,
  SUI_DECIMALS,
  SUI_FRAMEWORK_ADDRESS,
  SUI_SYSTEM_ADDRESS,
  SUI_SYSTEM_MODULE_NAME,
  SUI_SYSTEM_STATE_OBJECT_ID,
  SUI_TYPE_ARG,
  assert,
  formatAddress,
  formatDigest,
  fromB64,
  is,
  isValidSuiAddress,
  isValidSuiObjectId,
  isValidTransactionDigest,
  normalizeStructTag,
  normalizeSuiAddress,
  normalizeSuiObjectId,
  parseStructTag,
  toB64
};
//# sourceMappingURL=index.js.map

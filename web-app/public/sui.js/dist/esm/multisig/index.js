import { fromB64 } from "@mysten/bcs";
import { publicKeyFromRawBytes } from "../verify/index.js";
import { SIGNATURE_FLAG_TO_SCHEME } from "../cryptography/index.js";
export * from "./publickey.js";
function publicKeyFromSuiBytes(publicKey) {
  const bytes = typeof publicKey === "string" ? fromB64(publicKey) : publicKey;
  const signatureScheme = SIGNATURE_FLAG_TO_SCHEME[bytes[0]];
  return publicKeyFromRawBytes(signatureScheme, bytes.slice(1));
}
export {
  publicKeyFromSuiBytes
};
//# sourceMappingURL=index.js.map

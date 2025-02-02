import { fromB64 } from "@mysten/bcs";
import { SIGNATURE_FLAG_TO_SCHEME } from "./signature.js";
import { Secp256r1PublicKey } from "../keypairs/secp256r1/publickey.js";
import { Secp256k1PublicKey } from "../keypairs/secp256k1/publickey.js";
import { Ed25519PublicKey } from "../keypairs/ed25519/publickey.js";
import { decodeMultiSig } from "./multisig.js";
import { Ed25519Keypair } from "../keypairs/ed25519/keypair.js";
import { Secp256k1Keypair } from "../keypairs/secp256k1/keypair.js";
import { LEGACY_PRIVATE_KEY_SIZE, PRIVATE_KEY_SIZE } from "./keypair.js";
function toParsedSignaturePubkeyPair(serializedSignature) {
  const bytes = fromB64(serializedSignature);
  const signatureScheme = SIGNATURE_FLAG_TO_SCHEME[bytes[0]];
  if (signatureScheme === "MultiSig") {
    try {
      return decodeMultiSig(serializedSignature);
    } catch (e) {
      throw new Error("legacy multisig viewing unsupported");
    }
  }
  const SIGNATURE_SCHEME_TO_PUBLIC_KEY = {
    ED25519: Ed25519PublicKey,
    Secp256k1: Secp256k1PublicKey,
    Secp256r1: Secp256r1PublicKey
  };
  const PublicKey = SIGNATURE_SCHEME_TO_PUBLIC_KEY[signatureScheme];
  const signature = bytes.slice(1, bytes.length - PublicKey.SIZE);
  const pubkeyBytes = bytes.slice(1 + signature.length);
  const pubKey = new PublicKey(pubkeyBytes);
  return [
    {
      signatureScheme,
      signature,
      pubKey
    }
  ];
}
function toSingleSignaturePubkeyPair(serializedSignature) {
  const res = toParsedSignaturePubkeyPair(serializedSignature);
  if (res.length !== 1) {
    throw Error("Expected a single signature");
  }
  return res[0];
}
function publicKeyFromSerialized(schema, pubKey) {
  if (schema === "ED25519") {
    return new Ed25519PublicKey(pubKey);
  }
  if (schema === "Secp256k1") {
    return new Secp256k1PublicKey(pubKey);
  }
  throw new Error("Unknown public key schema");
}
function fromExportedKeypair(keypair) {
  const secretKey = fromB64(keypair.privateKey);
  switch (keypair.schema) {
    case "ED25519":
      let pureSecretKey = secretKey;
      if (secretKey.length === LEGACY_PRIVATE_KEY_SIZE) {
        pureSecretKey = secretKey.slice(0, PRIVATE_KEY_SIZE);
      }
      return Ed25519Keypair.fromSecretKey(pureSecretKey);
    case "Secp256k1":
      return Secp256k1Keypair.fromSecretKey(secretKey);
    default:
      throw new Error(`Invalid keypair schema ${keypair.schema}`);
  }
}
export {
  fromExportedKeypair,
  publicKeyFromSerialized,
  toParsedSignaturePubkeyPair,
  toSingleSignaturePubkeyPair
};
//# sourceMappingURL=utils.js.map

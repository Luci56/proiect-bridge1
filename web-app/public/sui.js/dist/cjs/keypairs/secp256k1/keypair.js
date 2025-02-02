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
var keypair_exports = {};
__export(keypair_exports, {
  DEFAULT_SECP256K1_DERIVATION_PATH: () => DEFAULT_SECP256K1_DERIVATION_PATH,
  Secp256k1Keypair: () => Secp256k1Keypair
});
module.exports = __toCommonJS(keypair_exports);
var import_keypair = require("../../cryptography/keypair.js");
var import_sha256 = require("@noble/hashes/sha256");
var import_publickey = require("./publickey.js");
var import_secp256k1 = require("@noble/curves/secp256k1");
var import_mnemonics = require("../../cryptography/mnemonics.js");
var import_bip32 = require("@scure/bip32");
var import_bcs = require("@mysten/bcs");
var import_utils = require("@noble/hashes/utils");
var import_blake2b = require("@noble/hashes/blake2b");
const DEFAULT_SECP256K1_DERIVATION_PATH = "m/54'/784'/0'/0/0";
class Secp256k1Keypair extends import_keypair.Keypair {
  /**
   * Create a new keypair instance.
   * Generate random keypair if no {@link Secp256k1Keypair} is provided.
   *
   * @param keypair secp256k1 keypair
   */
  constructor(keypair) {
    super();
    if (keypair) {
      this.keypair = keypair;
    } else {
      const secretKey = import_secp256k1.secp256k1.utils.randomPrivateKey();
      const publicKey = import_secp256k1.secp256k1.getPublicKey(secretKey, true);
      this.keypair = { publicKey, secretKey };
    }
  }
  /**
   * Get the key scheme of the keypair Secp256k1
   */
  getKeyScheme() {
    return "Secp256k1";
  }
  /**
   * Generate a new random keypair
   */
  static generate() {
    return new Secp256k1Keypair();
  }
  /**
   * Create a keypair from a raw secret key byte array.
   *
   * This method should only be used to recreate a keypair from a previously
   * generated secret key. Generating keypairs from a random seed should be done
   * with the {@link Keypair.fromSeed} method.
   *
   * @throws error if the provided secret key is invalid and validation is not skipped.
   *
   * @param secretKey secret key byte array
   * @param options: skip secret key validation
   */
  static fromSecretKey(secretKey, options) {
    const publicKey = import_secp256k1.secp256k1.getPublicKey(secretKey, true);
    if (!options || !options.skipValidation) {
      const encoder = new TextEncoder();
      const signData = encoder.encode("sui validation");
      const msgHash = (0, import_utils.bytesToHex)((0, import_blake2b.blake2b)(signData, { dkLen: 32 }));
      const signature = import_secp256k1.secp256k1.sign(msgHash, secretKey);
      if (!import_secp256k1.secp256k1.verify(signature, msgHash, publicKey, { lowS: true })) {
        throw new Error("Provided secretKey is invalid");
      }
    }
    return new Secp256k1Keypair({ publicKey, secretKey });
  }
  /**
   * Generate a keypair from a 32 byte seed.
   *
   * @param seed seed byte array
   */
  static fromSeed(seed) {
    let publicKey = import_secp256k1.secp256k1.getPublicKey(seed, true);
    return new Secp256k1Keypair({ publicKey, secretKey: seed });
  }
  /**
   * The public key for this keypair
   */
  getPublicKey() {
    return new import_publickey.Secp256k1PublicKey(this.keypair.publicKey);
  }
  async sign(data) {
    return this.signData(data);
  }
  /**
   * Return the signature for the provided data.
   */
  signData(data) {
    const msgHash = (0, import_sha256.sha256)(data);
    const sig = import_secp256k1.secp256k1.sign(msgHash, this.keypair.secretKey, {
      lowS: true
    });
    return sig.toCompactRawBytes();
  }
  /**
   * Derive Secp256k1 keypair from mnemonics and path. The mnemonics must be normalized
   * and validated against the english wordlist.
   *
   * If path is none, it will default to m/54'/784'/0'/0/0, otherwise the path must
   * be compliant to BIP-32 in form m/54'/784'/{account_index}'/{change_index}/{address_index}.
   */
  static deriveKeypair(mnemonics, path) {
    if (path == null) {
      path = DEFAULT_SECP256K1_DERIVATION_PATH;
    }
    if (!(0, import_mnemonics.isValidBIP32Path)(path)) {
      throw new Error("Invalid derivation path");
    }
    const key = import_bip32.HDKey.fromMasterSeed((0, import_mnemonics.mnemonicToSeed)(mnemonics)).derive(path);
    if (key.publicKey == null || key.privateKey == null) {
      throw new Error("Invalid key");
    }
    return new Secp256k1Keypair({
      publicKey: key.publicKey,
      secretKey: key.privateKey
    });
  }
  export() {
    return {
      schema: "Secp256k1",
      privateKey: (0, import_bcs.toB64)(this.keypair.secretKey)
    };
  }
}
//# sourceMappingURL=keypair.js.map

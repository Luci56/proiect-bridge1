"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var keypair_exports = {};
__export(keypair_exports, {
  DEFAULT_ED25519_DERIVATION_PATH: () => DEFAULT_ED25519_DERIVATION_PATH,
  Ed25519Keypair: () => Ed25519Keypair
});
module.exports = __toCommonJS(keypair_exports);
var import_tweetnacl = __toESM(require("tweetnacl"));
var import_publickey = require("./publickey.js");
var import_mnemonics = require("../../cryptography/mnemonics.js");
var import_ed25519_hd_key = require("./ed25519-hd-key.js");
var import_bcs = require("@mysten/bcs");
var import_keypair = require("../../cryptography/keypair.js");
const DEFAULT_ED25519_DERIVATION_PATH = "m/44'/784'/0'/0'/0'";
class Ed25519Keypair extends import_keypair.Keypair {
  /**
   * Create a new Ed25519 keypair instance.
   * Generate random keypair if no {@link Ed25519Keypair} is provided.
   *
   * @param keypair Ed25519 keypair
   */
  constructor(keypair) {
    super();
    if (keypair) {
      this.keypair = keypair;
    } else {
      this.keypair = import_tweetnacl.default.sign.keyPair();
    }
  }
  /**
   * Get the key scheme of the keypair ED25519
   */
  getKeyScheme() {
    return "ED25519";
  }
  /**
   * Generate a new random Ed25519 keypair
   */
  static generate() {
    return new Ed25519Keypair(import_tweetnacl.default.sign.keyPair());
  }
  /**
   * Create a Ed25519 keypair from a raw secret key byte array, also known as seed.
   * This is NOT the private scalar which is result of hashing and bit clamping of
   * the raw secret key.
   *
   * The sui.keystore key is a list of Base64 encoded `flag || privkey`. To import
   * a key from sui.keystore to typescript, decode from base64 and remove the first
   * flag byte after checking it is indeed the Ed25519 scheme flag 0x00 (See more
   * on flag for signature scheme: https://github.com/MystenLabs/sui/blob/818406c5abdf7de1b80915a0519071eec3a5b1c7/crates/sui-types/src/crypto.rs#L1650):
   * ```
   * import { Ed25519Keypair, fromB64 } from '@mysten/sui.js';
   * const raw = fromB64(t[1]);
   * if (raw[0] !== 0 || raw.length !== PRIVATE_KEY_SIZE + 1) {
   *   throw new Error('invalid key');
   * }
   * const imported = Ed25519Keypair.fromSecretKey(raw.slice(1))
   * ```
   * @throws error if the provided secret key is invalid and validation is not skipped.
   *
   * @param secretKey secret key byte array
   * @param options: skip secret key validation
   */
  static fromSecretKey(secretKey, options) {
    const secretKeyLength = secretKey.length;
    if (secretKeyLength !== import_keypair.PRIVATE_KEY_SIZE) {
      throw new Error(
        `Wrong secretKey size. Expected ${import_keypair.PRIVATE_KEY_SIZE} bytes, got ${secretKeyLength}.`
      );
    }
    const keypair = import_tweetnacl.default.sign.keyPair.fromSeed(secretKey);
    if (!options || !options.skipValidation) {
      const encoder = new TextEncoder();
      const signData = encoder.encode("sui validation");
      const signature = import_tweetnacl.default.sign.detached(signData, keypair.secretKey);
      if (!import_tweetnacl.default.sign.detached.verify(signData, signature, keypair.publicKey)) {
        throw new Error("provided secretKey is invalid");
      }
    }
    return new Ed25519Keypair(keypair);
  }
  /**
   * The public key for this Ed25519 keypair
   */
  getPublicKey() {
    return new import_publickey.Ed25519PublicKey(this.keypair.publicKey);
  }
  async sign(data) {
    return this.signData(data);
  }
  /**
   * Return the signature for the provided data using Ed25519.
   */
  signData(data) {
    return import_tweetnacl.default.sign.detached(data, this.keypair.secretKey);
  }
  /**
   * Derive Ed25519 keypair from mnemonics and path. The mnemonics must be normalized
   * and validated against the english wordlist.
   *
   * If path is none, it will default to m/44'/784'/0'/0'/0', otherwise the path must
   * be compliant to SLIP-0010 in form m/44'/784'/{account_index}'/{change_index}'/{address_index}'.
   */
  static deriveKeypair(mnemonics, path) {
    if (path == null) {
      path = DEFAULT_ED25519_DERIVATION_PATH;
    }
    if (!(0, import_mnemonics.isValidHardenedPath)(path)) {
      throw new Error("Invalid derivation path");
    }
    const { key } = (0, import_ed25519_hd_key.derivePath)(path, (0, import_mnemonics.mnemonicToSeedHex)(mnemonics));
    return Ed25519Keypair.fromSecretKey(key);
  }
  /**
   * Derive Ed25519 keypair from mnemonicSeed and path.
   *
   * If path is none, it will default to m/44'/784'/0'/0'/0', otherwise the path must
   * be compliant to SLIP-0010 in form m/44'/784'/{account_index}'/{change_index}'/{address_index}'.
   */
  static deriveKeypairFromSeed(seedHex, path) {
    if (path == null) {
      path = DEFAULT_ED25519_DERIVATION_PATH;
    }
    if (!(0, import_mnemonics.isValidHardenedPath)(path)) {
      throw new Error("Invalid derivation path");
    }
    const { key } = (0, import_ed25519_hd_key.derivePath)(path, seedHex);
    return Ed25519Keypair.fromSecretKey(key);
  }
  /**
   * This returns an exported keypair object, the private key field is the pure 32-byte seed.
   */
  export() {
    return {
      schema: "ED25519",
      privateKey: (0, import_bcs.toB64)(this.keypair.secretKey.slice(0, import_keypair.PRIVATE_KEY_SIZE))
    };
  }
}
//# sourceMappingURL=keypair.js.map

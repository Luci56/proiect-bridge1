import type { ExportedKeypair } from '../../cryptography/keypair.js';
import { Keypair } from '../../cryptography/keypair.js';
import type { PublicKey } from '../../cryptography/publickey.js';
import type { SignatureScheme } from '../../cryptography/signature.js';
export declare const DEFAULT_SECP256R1_DERIVATION_PATH = "m/74'/784'/0'/0/0";
/**
 * Secp256r1 Keypair data
 */
export interface Secp256r1KeypairData {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
}
/**
 * An Secp256r1 Keypair used for signing transactions.
 */
export declare class Secp256r1Keypair extends Keypair {
    private keypair;
    /**
     * Create a new keypair instance.
     * Generate random keypair if no {@link Secp256r1Keypair} is provided.
     *
     * @param keypair Secp256r1 keypair
     */
    constructor(keypair?: Secp256r1KeypairData);
    /**
     * Get the key scheme of the keypair Secp256r1
     */
    getKeyScheme(): SignatureScheme;
    /**
     * Generate a new random keypair
     */
    static generate(): Secp256r1Keypair;
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
    static fromSecretKey(secretKey: Uint8Array, options?: {
        skipValidation?: boolean;
    }): Secp256r1Keypair;
    /**
     * Generate a keypair from a 32 byte seed.
     *
     * @param seed seed byte array
     */
    static fromSeed(seed: Uint8Array): Secp256r1Keypair;
    /**
     * The public key for this keypair
     */
    getPublicKey(): PublicKey;
    sign(data: Uint8Array): Promise<Uint8Array>;
    /**
     * Return the signature for the provided data.
     */
    signData(data: Uint8Array): Uint8Array;
    /**
     * Derive Secp256r1 keypair from mnemonics and path. The mnemonics must be normalized
     * and validated against the english wordlist.
     *
     * If path is none, it will default to m/74'/784'/0'/0/0, otherwise the path must
     * be compliant to BIP-32 in form m/74'/784'/{account_index}'/{change_index}/{address_index}.
     */
    static deriveKeypair(mnemonics: string, path?: string): Secp256r1Keypair;
    export(): ExportedKeypair;
}

import type { Infer } from 'superstruct';
import { TransactionType, TransactionBlockInput } from './Transactions.js';
export declare const TransactionExpiration: import("superstruct").Struct<{
    Epoch: number;
} | {
    None: true | null;
} | null | undefined, null>;
export type TransactionExpiration = Infer<typeof TransactionExpiration>;
declare const GasConfig: import("superstruct").Struct<{
    payment?: {
        objectId: string;
        version: string | number;
        digest: string;
    }[] | undefined;
    owner?: string | undefined;
    price?: string | undefined;
    budget?: string | undefined;
}, {
    budget: import("superstruct").Struct<string | undefined, null>;
    price: import("superstruct").Struct<string | undefined, null>;
    payment: import("superstruct").Struct<{
        objectId: string;
        version: string | number;
        digest: string;
    }[] | undefined, import("superstruct").Struct<{
        objectId: string;
        version: string | number;
        digest: string;
    }, {
        digest: import("superstruct").Struct<string, null>;
        objectId: import("superstruct").Struct<string, null>;
        version: import("superstruct").Struct<string | number, null>;
    }>>;
    owner: import("superstruct").Struct<string | undefined, null>;
}>;
type GasConfig = Infer<typeof GasConfig>;
export declare const SerializedTransactionDataBuilder: import("superstruct").Struct<{
    version: 1;
    transactions: ({
        arguments: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "MoveCall";
        target: `${string}::${string}::${string}`;
        typeArguments: string[];
    } | {
        objects: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "TransferObjects";
        address: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
    } | {
        kind: "SplitCoins";
        coin: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
        amounts: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
    } | {
        kind: "MergeCoins";
        destination: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
        sources: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
    } | {
        objects: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "MakeMoveVec";
        type?: {
            None: true | null;
        } | {
            Some: Record<string, unknown>;
        } | undefined;
    } | {
        kind: "Publish";
        dependencies: string[];
        modules: number[][];
    } | {
        packageId: string;
        kind: "Upgrade";
        dependencies: string[];
        modules: number[][];
        ticket: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
    })[];
    inputs: {
        kind: "Input";
        index: number;
        type?: "object" | "pure" | undefined;
        value?: any;
    }[];
    gasConfig: {
        payment?: {
            objectId: string;
            version: string | number;
            digest: string;
        }[] | undefined;
        owner?: string | undefined;
        price?: string | undefined;
        budget?: string | undefined;
    };
    sender?: string | undefined;
    expiration?: {
        Epoch: number;
    } | {
        None: true | null;
    } | null | undefined;
}, {
    version: import("superstruct").Struct<1, 1>;
    sender: import("superstruct").Struct<string | undefined, null>;
    expiration: import("superstruct").Struct<{
        Epoch: number;
    } | {
        None: true | null;
    } | null | undefined, null>;
    gasConfig: import("superstruct").Struct<{
        payment?: {
            objectId: string;
            version: string | number;
            digest: string;
        }[] | undefined;
        owner?: string | undefined;
        price?: string | undefined;
        budget?: string | undefined;
    }, {
        budget: import("superstruct").Struct<string | undefined, null>;
        price: import("superstruct").Struct<string | undefined, null>;
        payment: import("superstruct").Struct<{
            objectId: string;
            version: string | number;
            digest: string;
        }[] | undefined, import("superstruct").Struct<{
            objectId: string;
            version: string | number;
            digest: string;
        }, {
            digest: import("superstruct").Struct<string, null>;
            objectId: import("superstruct").Struct<string, null>;
            version: import("superstruct").Struct<string | number, null>;
        }>>;
        owner: import("superstruct").Struct<string | undefined, null>;
    }>;
    inputs: import("superstruct").Struct<{
        kind: "Input";
        index: number;
        type?: "object" | "pure" | undefined;
        value?: any;
    }[], import("superstruct").Struct<{
        kind: "Input";
        index: number;
        type?: "object" | "pure" | undefined;
        value?: any;
    }, {
        kind: import("superstruct").Struct<"Input", "Input">;
        index: import("superstruct").Struct<number, null>;
        value: import("superstruct").Struct<any, null>;
        type: import("superstruct").Struct<"object" | "pure" | undefined, null>;
    }>>;
    transactions: import("superstruct").Struct<({
        arguments: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "MoveCall";
        target: `${string}::${string}::${string}`;
        typeArguments: string[];
    } | {
        objects: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "TransferObjects";
        address: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
    } | {
        kind: "SplitCoins";
        coin: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
        amounts: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
    } | {
        kind: "MergeCoins";
        destination: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
        sources: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
    } | {
        objects: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "MakeMoveVec";
        type?: {
            None: true | null;
        } | {
            Some: Record<string, unknown>;
        } | undefined;
    } | {
        kind: "Publish";
        dependencies: string[];
        modules: number[][];
    } | {
        packageId: string;
        kind: "Upgrade";
        dependencies: string[];
        modules: number[][];
        ticket: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
    })[], import("superstruct").Struct<{
        arguments: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "MoveCall";
        target: `${string}::${string}::${string}`;
        typeArguments: string[];
    } | {
        objects: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "TransferObjects";
        address: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
    } | {
        kind: "SplitCoins";
        coin: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
        amounts: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
    } | {
        kind: "MergeCoins";
        destination: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
        sources: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
    } | {
        objects: ({
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        })[];
        kind: "MakeMoveVec";
        type?: {
            None: true | null;
        } | {
            Some: Record<string, unknown>;
        } | undefined;
    } | {
        kind: "Publish";
        dependencies: string[];
        modules: number[][];
    } | {
        packageId: string;
        kind: "Upgrade";
        dependencies: string[];
        modules: number[][];
        ticket: {
            kind: "Input";
            index: number;
            type?: "object" | "pure" | undefined;
            value?: any;
        } | {
            kind: "GasCoin";
        } | {
            kind: "Result";
            index: number;
        } | {
            kind: "NestedResult";
            index: number;
            resultIndex: number;
        };
    }, null>>;
}>;
export type SerializedTransactionDataBuilder = Infer<typeof SerializedTransactionDataBuilder>;
export declare class TransactionBlockDataBuilder {
    static fromKindBytes(bytes: Uint8Array): TransactionBlockDataBuilder;
    static fromBytes(bytes: Uint8Array): TransactionBlockDataBuilder;
    static restore(data: SerializedTransactionDataBuilder): TransactionBlockDataBuilder;
    /**
     * Generate transaction digest.
     *
     * @param bytes BCS serialized transaction data
     * @returns transaction digest.
     */
    static getDigestFromBytes(bytes: Uint8Array): string;
    version: 1;
    sender?: string;
    expiration?: TransactionExpiration;
    gasConfig: GasConfig;
    inputs: TransactionBlockInput[];
    transactions: TransactionType[];
    constructor(clone?: SerializedTransactionDataBuilder);
    build({ maxSizeBytes, overrides, onlyTransactionKind, }?: {
        maxSizeBytes?: number;
        overrides?: Pick<Partial<TransactionBlockDataBuilder>, 'sender' | 'gasConfig' | 'expiration'>;
        onlyTransactionKind?: boolean;
    }): Uint8Array;
    getDigest(): string;
    snapshot(): SerializedTransactionDataBuilder;
}
export {};

import type { Infer } from 'superstruct';
export declare const ResolvedNameServiceNames: import("superstruct").Struct<{
    data: string[];
    nextCursor: string | null;
    hasNextPage: boolean;
}, {
    data: import("superstruct").Struct<string[], import("superstruct").Struct<string, null>>;
    hasNextPage: import("superstruct").Struct<boolean, null>;
    nextCursor: import("superstruct").Struct<string | null, null>;
}>;
export type ResolvedNameServiceNames = Infer<typeof ResolvedNameServiceNames>;

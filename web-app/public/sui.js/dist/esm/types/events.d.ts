import type { Infer } from 'superstruct';
import type { SuiJsonValue } from './common.js';
export declare const EventId: import("superstruct").Struct<{
    txDigest: string;
    eventSeq: string;
}, {
    txDigest: import("superstruct").Struct<string, null>;
    eventSeq: import("superstruct").Struct<string, null>;
}>;
export declare const SuiEvent: import("superstruct").Struct<{
    id: {
        txDigest: string;
        eventSeq: string;
    };
    packageId: string;
    transactionModule: string;
    sender: string;
    type: string;
    parsedJson?: Record<string, any> | undefined;
    bcs?: string | undefined;
    timestampMs?: string | undefined;
}, {
    id: import("superstruct").Struct<{
        txDigest: string;
        eventSeq: string;
    }, {
        txDigest: import("superstruct").Struct<string, null>;
        eventSeq: import("superstruct").Struct<string, null>;
    }>;
    packageId: import("superstruct").Struct<string, null>;
    transactionModule: import("superstruct").Struct<string, null>;
    sender: import("superstruct").Struct<string, null>;
    type: import("superstruct").Struct<string, null>;
    parsedJson: import("superstruct").Struct<Record<string, any> | undefined, null>;
    bcs: import("superstruct").Struct<string | undefined, null>;
    timestampMs: import("superstruct").Struct<string | undefined, null>;
}>;
export type SuiEvent = Infer<typeof SuiEvent>;
export type MoveEventField = {
    path: string;
    value: SuiJsonValue;
};
/**
 * Sequential event ID, ie (transaction seq number, event seq number).
 * 1) Serves as a unique event ID for each fullnode
 * 2) Also serves to sequence events for the purposes of pagination and querying.
 *    A higher id is an event seen later by that fullnode.
 * This ID is the "cursor" for event querying.
 */
export type EventId = Infer<typeof EventId>;
export type SuiEventFilter = {
    Package: string;
} | {
    MoveModule: {
        package: string;
        module: string;
    };
} | {
    MoveEventType: string;
} | {
    MoveEventField: MoveEventField;
} | {
    Transaction: string;
} | {
    TimeRange: {
        startTime: string;
        endTime: string;
    };
} | {
    Sender: string;
} | {
    All: SuiEventFilter[];
} | {
    Any: SuiEventFilter[];
} | {
    And: [SuiEventFilter, SuiEventFilter];
} | {
    Or: [SuiEventFilter, SuiEventFilter];
};
export declare const PaginatedEvents: import("superstruct").Struct<{
    data: {
        id: {
            txDigest: string;
            eventSeq: string;
        };
        packageId: string;
        transactionModule: string;
        sender: string;
        type: string;
        parsedJson?: Record<string, any> | undefined;
        bcs?: string | undefined;
        timestampMs?: string | undefined;
    }[];
    nextCursor: {
        txDigest: string;
        eventSeq: string;
    } | null;
    hasNextPage: boolean;
}, {
    data: import("superstruct").Struct<{
        id: {
            txDigest: string;
            eventSeq: string;
        };
        packageId: string;
        transactionModule: string;
        sender: string;
        type: string;
        parsedJson?: Record<string, any> | undefined;
        bcs?: string | undefined;
        timestampMs?: string | undefined;
    }[], import("superstruct").Struct<{
        id: {
            txDigest: string;
            eventSeq: string;
        };
        packageId: string;
        transactionModule: string;
        sender: string;
        type: string;
        parsedJson?: Record<string, any> | undefined;
        bcs?: string | undefined;
        timestampMs?: string | undefined;
    }, {
        id: import("superstruct").Struct<{
            txDigest: string;
            eventSeq: string;
        }, {
            txDigest: import("superstruct").Struct<string, null>;
            eventSeq: import("superstruct").Struct<string, null>;
        }>;
        packageId: import("superstruct").Struct<string, null>;
        transactionModule: import("superstruct").Struct<string, null>;
        sender: import("superstruct").Struct<string, null>;
        type: import("superstruct").Struct<string, null>;
        parsedJson: import("superstruct").Struct<Record<string, any> | undefined, null>;
        bcs: import("superstruct").Struct<string | undefined, null>;
        timestampMs: import("superstruct").Struct<string | undefined, null>;
    }>>;
    nextCursor: import("superstruct").Struct<{
        txDigest: string;
        eventSeq: string;
    } | null, {
        txDigest: import("superstruct").Struct<string, null>;
        eventSeq: import("superstruct").Struct<string, null>;
    }>;
    hasNextPage: import("superstruct").Struct<boolean, null>;
}>;
export type PaginatedEvents = Infer<typeof PaginatedEvents>;
export declare function getEventSender(event: SuiEvent): string;
export declare function getEventPackage(event: SuiEvent): string;

import type { TypeTag } from '../bcs/index.js';
export declare class TypeTagSerializer {
    static parseFromStr(str: string, normalizeAddress?: boolean): TypeTag;
    static parseStructTypeArgs(str: string, normalizeAddress?: boolean): TypeTag[];
    static tagToString(tag: TypeTag): string;
}

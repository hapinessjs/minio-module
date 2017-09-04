export interface MinioCopyCondition {
    modified?: Date;
    unmodified?: Date;
    matchETag?: string;
    matchETagExcept?: string;

    setModified(date: Date): void;
    setUnmodified(date: Date): void;
    setMatchETag(etag: string): void;
    setMatchETagExcept(etag: string): void;
}

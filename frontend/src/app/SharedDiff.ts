import {Diff2Html} from 'diff2html';

export interface SharedDiff {
    id?: string,
    created: Date,
    expiresAt: Date,
    diff: Diff2Html.Result[],
    rawDiff: string,
};


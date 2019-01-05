import {Diff2Html} from 'diff2html';

export interface SharedDiff {
    id?: string,
    created: Date,
    expiresAt: Date,
    diff: Diff2Html.Result[],
    rawDiff: string,
};

export function makeSharedDiff(raw_diff: string, date: Date = new Date()): SharedDiff {
    let expire_date = new Date();
    expire_date.setDate(date.getDate() + 1);
    return {
        created: date,
        expiresAt: expire_date,
        diff: Diff2Html.getJsonFromDiff(raw_diff),
        rawDiff: raw_diff,
    };
}


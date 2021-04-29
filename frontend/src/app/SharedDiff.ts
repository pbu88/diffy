import { Diff2Html } from 'diff2html';
const DIFF_MAX_DATE = new Date('9999-01-01');

export interface SharedDiff {
  id?: string,
  created: Date,
  expiresAt: Date,
  diff: Diff2Html.Result[],
  rawDiff: string,
  isPermanent: () => boolean
}
;

export function makeSharedDiff(raw_diff: string, date: Date = new Date()): SharedDiff {
  let expire_date = new Date();
  expire_date.setDate(date.getDate() + 1);
  return {
    created: date,
    expiresAt: expire_date,
    diff: Diff2Html.getJsonFromDiff(raw_diff),
    rawDiff: raw_diff,
    isPermanent: function() {
      return this.expiresAt >= DIFF_MAX_DATE;
    }
  };
}

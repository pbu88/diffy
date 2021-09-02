import * as Diff2Html from 'diff2html';
import { DiffFile } from 'diff2html/lib/types';

const MAX_DIFF_DATE = new Date('9999-01-01');  

export interface SharedDiff {
  id?: string,
  created: Date,
  expiresAt: Date,
  diff: DiffFile[],
  rawDiff: string,
};

export function makeSharedDiff(raw_diff: string, createdDate: Date = new Date()): SharedDiff {
  const expireDate = calculateExpireDate(createdDate)
  return makeSharedDiffWithId(null, raw_diff, createdDate, expireDate)
}

/**
 * Returns a new SharedDiff with the expiresAt set at {@link MAX_DIFF_DATE}
 * @param diff - a shared diff
 * @returns a new SharedDiff
 */
export function makePermanent(diff: SharedDiff): SharedDiff {
  return {...diff, expiresAt: MAX_DIFF_DATE }
}

export function makeSharedDiffWithId(id: string, raw_diff: string, createdDate: Date, expireDate: Date): SharedDiff {
  return {
    id: id,
    created: createdDate,
    expiresAt: expireDate,
    diff: Diff2Html.parse(raw_diff),
    rawDiff: raw_diff,
  };
}

function calculateExpireDate(date: Date) {
  let expire_date = new Date();
  expire_date.setDate(date.getDate() + 1);
  return expire_date;
}

export function isValidRawDiff(raw_diff: string): boolean {
  const jsonDiff = Diff2Html.parse(raw_diff);
  if (_isObjectEmpty(jsonDiff)) {
    return false;
  }
  return true;
}

function _isObjectEmpty(obj: DiffFile[]): boolean {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
};

import * as Diff2Html from 'diff2html';
import { DiffFile } from 'diff2html/lib/types';

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

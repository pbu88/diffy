import * as Diff2Html from 'diff2html';
import { DiffFile } from 'diff2html/lib/types';
import { SharedDiff } from 'diffy-models';

const MAX_DIFF_DATE = new Date('9999-01-01');
const MILLIS_IN_A_DAY = 86400000.0;

export function makeSharedDiff(raw_diff: string, createdDate: Date = new Date()): SharedDiff {
  const expireDate = calculateExpireDate(createdDate)
  return makeSharedDiffWithId(null, raw_diff, createdDate, expireDate)
}

/**
 * Returns a new SharedDiff with the expiresAt set at {@link MAX_DIFF_DATE}
 * @param diff - a shared diff
 * @returns - a new SharedDiff
 */
export function makePermanent(diff: SharedDiff): SharedDiff {
  return { ...diff, expiresAt: MAX_DIFF_DATE }
}

/**
 * Returns a new SharedDiff with a expiresAt date set to further in the future (by number of hours).
 * @param diff - a shared diff
 * @param hours - the number of hours by which to extend the expire time date
 * @returns - a new SharedDiff with the expiresAt date changed
 */
export function extendLifetime(diff: SharedDiff, hours: number): SharedDiff {
  const newDate = new Date(diff.expiresAt.getTime() + (hours * 60 * 60 * 1000));
  return { ...diff, expiresAt: newDate }
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

/**
 * Returns the number of time this diff has been extended. It uses a day (24 hours) as the unit
 * of extension and doesn't count the first 24 hours which are the default lifetime.
 */
export function lifetimeExtensionCount(diff: SharedDiff): number {
  const millis = diff.expiresAt.getTime() - diff.created.getTime()
  return Math.round((millis / (MILLIS_IN_A_DAY))) - 1;
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


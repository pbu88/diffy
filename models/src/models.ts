import { DiffFile } from 'diff2html/lib/types';

export interface DiffyInput {
    rawDiff: string;
}

export interface SharedDiff {
  id?: string,
  created: Date,
  expiresAt: Date,
  diff: DiffFile[],
  rawDiff: string,
};
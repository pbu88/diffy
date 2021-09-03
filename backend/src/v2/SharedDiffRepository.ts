import {SharedDiff} from './SharedDiff';

export interface SharedDiffRepository {
  insert: (diff: SharedDiff) => Promise<SharedDiff>;
  fetchById: (id: string) => Promise<SharedDiff>;
  deleteById: (id: string) => Promise<number>;
  update(diff: SharedDiff): Promise<SharedDiff>;
}

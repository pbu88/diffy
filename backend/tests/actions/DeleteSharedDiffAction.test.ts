import {DeleteSharedDiffAction} from '../../src/actions/DeleteSharedDiffAction';
import {SharedDiffRepository} from '../../src/sharedDiffRepository/SharedDiffRepository';
import { SharedDiff } from 'diffy-models';

import {metrics} from '../MockedMetrics';

test('should create a DeleteSharedDiffAction and delete a SharedDiff by id', () => {
  const repo: SharedDiffRepository = {
    insert: jest.fn(),
    fetchById: jest.fn(),
    deleteById: (id: string) => Promise.resolve(1),
    update: (diff: SharedDiff) => Promise.reject('random err'),
    deleteExpired: jest.fn(),
  };
  const action = new DeleteSharedDiffAction(repo, metrics);
  expect(action).toBeDefined();
    return action.deleteSharedDiff('<diff_id>')
        .then(deletedCount => {
            expect(deletedCount).toEqual(1)
            expect(metrics.diffDeletedSuccessfully).toHaveBeenCalled()
        });
});
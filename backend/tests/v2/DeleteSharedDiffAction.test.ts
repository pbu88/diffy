import {DeleteSharedDiffAction} from '../../src/v2/DeleteSharedDiffAction';
import {SharedDiffRepository} from '../../src/v2/SharedDiffRepository';
import {SharedDiff} from '../../src/v2/SharedDiff';

import {metrics} from './MockedMetrics';

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
import {DeleteSharedDiffAction} from '../../src/v2/DeleteSharedDiffAction';
import {SharedDiffRepository} from '../../src/v2/SharedDiffRepository';

import {metrics} from './MockedMetrics';

test('should create a DeleteSharedDiffAction and delete a SharedDiff by id', () => {
  const repo: SharedDiffRepository = {
    insert: jest.fn(),
    fetchById: jest.fn(),
    deleteById: (id: string) => Promise.resolve(1),
    extendLifetime: (id: string, noOfDays: number) => Promise.reject('random err'),
    makePermanent: (id: string) => Promise.reject('random err'),
  };
  const action = new DeleteSharedDiffAction(repo, metrics);
  expect(action).toBeDefined();
    return action.deleteSharedDiff('<diff_id>')
        .then(deletedCount => {
            expect(deletedCount).toEqual(1)
            expect(metrics.diffDeletedSuccessfully).toHaveBeenCalled()
        });
});
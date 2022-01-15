import { DeleteSharedDiffAction } from '../../src/actions/DeleteSharedDiffAction';
import { SharedDiffRepository } from '../../src/sharedDiffRepository/SharedDiffRepository';
import { Context, SharedDiff } from 'diffy-models';

import { metrics } from '../MockedMetrics';

test('should create a DeleteSharedDiffAction and delete a SharedDiff by id', () => {
  const repo: SharedDiffRepository = {
    insert: jest.fn(),
    fetchById: jest.fn(),
    deleteById: (id: string) => Promise.resolve(1),
    update: (diff: SharedDiff) => Promise.reject('random err'),
    deleteExpired: jest.fn(),
  };
  const action = new DeleteSharedDiffAction(repo, () => metrics);
  expect(action).toBeDefined();
  return action.execute({ id: '<diff_id>' }, {} as Context)
    .then(output => {
      expect(output.success).toEqual(true)
      expect(metrics.diffDeletedSuccessfully).toHaveBeenCalled()
    });
});
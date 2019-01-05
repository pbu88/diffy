import { SharedDiffRepository } from '../../src/v2/SharedDiffRepository';
import { DeleteSharedDiffAction } from '../../src/v2/DeleteSharedDiffAction';
import { metrics } from './MockedMetrics';

test('should create a DeleteSharedDiffAction and delete a SharedDiff by id', () => {
    const repo: SharedDiffRepository = {
        insert: jest.fn(),
        fetchById: jest.fn(),
        deleteById: (id: string) => Promise.resolve(1),
    }
    const action = new DeleteSharedDiffAction(repo, metrics);
    expect(action).toBeDefined();
    return action.deleteSharedDiff('<diff_id>')
        .then(deletedCount => {
            expect(deletedCount).toEqual(1)
            expect(metrics.diffDeletedSuccessfully).toHaveBeenCalled()
        });
});

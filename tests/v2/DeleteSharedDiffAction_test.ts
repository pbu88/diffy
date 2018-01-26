import { SharedDiffRepository } from '../../src/v2/SharedDiff';
import { DeleteSharedDiffAction } from '../../src/v2/DeleteSharedDiffAction';

test('should create a DeleteSharedDiffAction and delete a SharedDiff by id', () => {
    const repo: SharedDiffRepository = {
        insert: jest.fn(),
        fetchById: jest.fn(),
        deleteById: (id: string) => true,
    }
    const action = new DeleteSharedDiffAction(repo);
    expect(action).toBeDefined();
    const deleted = action.deleteSharedDiff('<diff_id>');
    expect(deleted).toEqual(true);
});

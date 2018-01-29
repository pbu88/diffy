import { SharedDiffRepository } from '../../src/v2/SharedDiffRepository';
import { DeleteSharedDiffAction } from '../../src/v2/DeleteSharedDiffAction';

test('should create a DeleteSharedDiffAction and delete a SharedDiff by id', () => {
    const repo: SharedDiffRepository = {
        insert: jest.fn(),
        fetchById: jest.fn(),
        deleteById: (id: string) => Promise.resolve(1),
    }
    const action = new DeleteSharedDiffAction(repo);
    expect(action).toBeDefined();
    return action.deleteSharedDiff('<diff_id>')
        .then(deletedCount => expect(deletedCount).toEqual(1));
});

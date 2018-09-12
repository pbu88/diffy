import { SharedDiff, makeSharedDiff } from '../../src/v2/SharedDiff';
import { SharedDiffRepository } from '../../src/v2/SharedDiffRepository';
import { GetSharedDiffAction } from '../../src/v2/GetSharedDiffAction';

test('should create a GetSharedDiffAction and fetch the SharedDiff', () => {
    const raw_diff = `
diff --git a/file.json b/file.json
index 1456e89..e1da2da 100644
--- a/file.json
+++ b/file.json
@@ -1,1 +1,1 @@
-a
+b
`
    const repo: SharedDiffRepository = {
        insert: jest.fn(),
        fetchById: (id: string) => Promise.resolve({id, ...makeSharedDiff(raw_diff)}),
        deleteById: (id: string) => Promise.resolve(0),
    }
    const action = new GetSharedDiffAction(repo);
    expect(action).toBeDefined();
    return action.getSharedDiff('<diff_id>')
        .then(shared_diff => {
            expect(shared_diff.id).toEqual('<diff_id>');
            expect(shared_diff.diff).toBeDefined();
        });
});

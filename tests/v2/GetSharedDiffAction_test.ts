import { SharedDiff, SharedDiffRepository, makeSharedDiff } from '../../src/v2/SharedDiff';
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
        fetchById: (id: string) => ({id, ...makeSharedDiff(raw_diff)}),
        deleteById: (id: string) => false,
    }
    const action = new GetSharedDiffAction(repo);
    expect(action).toBeDefined();
    const shared_diff = action.getSharedDiff('<diff_id>');
    expect(shared_diff.id).toEqual('<diff_id>');
    expect(shared_diff.diff).toBeDefined();
});

import { SharedDiff } from '../../src/v2/SharedDiff';
import { SharedDiffRepository } from '../../src/v2/SharedDiffRepository';
import { CreateSharedDiffAction } from '../../src/v2/CreateSharedDiffAction';

test('should create a CreateSharedDiffAction, create the SharedDiff and store it', () => {
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
        //insert: (diff: SharedDiff) => ({ id: '1', ...diff }),
        insert: jest.fn(),
        fetchById: (id: string) => null,
        deleteById: (id: string) => Promise.resolve(0),
    };
    const action = new CreateSharedDiffAction(repo);
    expect(action).toBeDefined();
    const shared_diff = action.createSharedDiff(raw_diff);
    expect(shared_diff.diff).toBeDefined();
    action.storeSharedDiff(shared_diff);
    expect(repo.insert).toHaveBeenCalled();
});

test('isValidRawDiff() should validate a raw diff', () => {
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
        //insert: (diff: SharedDiff) => ({ id: '1', ...diff }),
        insert: jest.fn(),
        fetchById: (id: string) => null,
        deleteById: (id: string) => Promise.resolve(0),
    };
    const action = new CreateSharedDiffAction(repo);
    const is_valid = action.isValidRawDiff(raw_diff);
    expect(is_valid).toBe(true);
});

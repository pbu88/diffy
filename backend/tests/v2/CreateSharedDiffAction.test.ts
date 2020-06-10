import {CreateSharedDiffAction} from '../../src/v2/CreateSharedDiffAction';
import {SharedDiff} from '../../src/v2/SharedDiff';
import {SharedDiffRepository} from '../../src/v2/SharedDiffRepository';

import {metrics} from './MockedMetrics';

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
    // insert: (diff: SharedDiff) => ({ id:
    // '1', ...diff }),
    insert: jest.fn(diff => Promise.resolve(diff)),
    fetchById: (id: string) => null,
    deleteById: (id: string) => Promise.resolve(0),
    extendLifetime: (id: string, noOfDays: number) => Promise.reject('random err'),
  };
  const action = new CreateSharedDiffAction(repo, metrics);
  expect(action).toBeDefined();
  const shared_diff = action.createSharedDiff(raw_diff);
  expect(shared_diff.diff).toBeDefined();
  return action.storeSharedDiff(shared_diff).then(() => {
    expect(repo.insert).toHaveBeenCalled();
    expect(metrics.diffStoredSuccessfully).toHaveBeenCalled();
  });
});

test('CreateSharedDiffAction.storeSharedDiff(), store fails when inserting', () => {
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
    // insert: (diff: SharedDiff) => ({ id:
    // '1', ...diff }),
    insert: jest.fn((diff) => Promise.reject(new Error('fake error'))),
    fetchById: (id: string) => null,
    deleteById: (id: string) => Promise.resolve(0),
    extendLifetime: (id: string, noOfDays: number) => Promise.reject('random err'),
  };
  const action = new CreateSharedDiffAction(repo, metrics);
  expect(action).toBeDefined();
  const shared_diff = action.createSharedDiff(raw_diff);
  expect(shared_diff.diff).toBeDefined();
  return action.storeSharedDiff(shared_diff).then(() => {
    expect(repo.insert).toHaveBeenCalled();
    expect(metrics.diffFailedToStore).toHaveBeenCalled();
  });
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
    // insert: (diff: SharedDiff) => ({ id:
    // '1', ...diff }),
    insert: jest.fn().mockReturnValueOnce(new Promise(() => {})),
    fetchById: (id: string) => null,
    deleteById: (id: string) => Promise.resolve(0),
    extendLifetime: (id: string, noOfDays: number) => Promise.reject('random err'),
  };
  const action = new CreateSharedDiffAction(repo, metrics);
  const is_valid = action.isValidRawDiff(raw_diff);
  expect(is_valid).toBe(true);
});

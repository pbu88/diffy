import { ExtendLifetimeSharedDiffAction } from '../../src/v2/ExtendLifetimeSharedDiffAction';
import { makeSharedDiff } from '../../src/v2/SharedDiff';
import { SharedDiffRepository } from '../../src/v2/SharedDiffRepository';
import { SharedDiff } from 'diffy-models';

jest.mock('../../src/v2/SharedDiffRepository');

import { metrics } from './MockedMetrics';

const raw_diff = `
diff --git a/file.json b/file.json
index 1456e89..e1da2da 100644
--- a/file.json
+++ b/file.json
@@ -1,1 +1,1 @@
-a
+b
`
const DIFF = makeSharedDiff(raw_diff);
const repo: SharedDiffRepository = {
  insert: jest.fn(),
  fetchById: (id: string) => Promise.resolve({ id, ...DIFF }),
  deleteById: (id: string) => Promise.resolve(0),
  update: (diff: SharedDiff) => Promise.resolve(diff),
  deleteExpired: jest.fn(),
};

test('should make a diff permanent', () => {
  const spy = jest.spyOn(repo, "update");
  const action = new ExtendLifetimeSharedDiffAction(repo, metrics);
  return action.makePermanent("1").then(diff => {
    expect(spy).toHaveBeenCalled();
    expect(diff.expiresAt.getFullYear()).toBe(9999);
  });
});

test('should extend the diff lifetime', () => {
  const spy = jest.spyOn(repo, "update");
  const action = new ExtendLifetimeSharedDiffAction(repo, metrics);
  return action.extendSharedDiffLifetime("1", 24).then(diff => {
    expect(spy).toHaveBeenCalled();
    expect(diff.expiresAt.getTime()).toBeGreaterThan(DIFF.expiresAt.getTime());
  });
});
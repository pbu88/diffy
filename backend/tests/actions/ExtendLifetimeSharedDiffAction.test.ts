import { ExtendLifetimeSharedDiffAction } from '../../src/actions/ExtendLifetimeSharedDiffAction';
import { makeSharedDiff } from '../../src/SharedDiff';
import { SharedDiffRepository } from '../../src/sharedDiffRepository/SharedDiffRepository';
import { SharedDiff } from 'diffy-models';

jest.mock('../../src/sharedDiffRepository/SharedDiffRepository');

import { metrics } from '../MockedMetrics';

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
  const action = new ExtendLifetimeSharedDiffAction(repo, () => metrics);
  return action.execute({ id: "1" }, {} as any).then(output => {
    expect(spy).toHaveBeenCalled();
    expect((metrics.diffLifetimeExtendedSuccessfully as any).mock.calls.length).toBe(1);
    expect((metrics.diffLifetimeExtendedSuccessfully as any).mock.calls[0][0]).toBe(1);
    expect(output.sharedDiff.expiresAt.getTime()).toBeGreaterThan(DIFF.expiresAt.getTime());
  });
});
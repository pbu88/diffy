import { ExtendLifetimeSharedDiffAction } from '../../src/v2/ExtendLifetimeSharedDiffAction';
import { makeSharedDiff } from '../../src/v2/SharedDiff';
import { SharedDiffRepository } from '../../src/v2/SharedDiffRepository';
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
const repo: SharedDiffRepository = {
  insert: jest.fn(),
  fetchById: (id: string) => Promise.resolve({ id, ...makeSharedDiff(raw_diff) }),
  deleteById: (id: string) => Promise.resolve(0),
  extendLifetime: (id: string, noOfDays: number) => Promise.reject('random err'),
  makePermanent: jest.fn()
};

test('should make a diff permanent', () => {
  const action = new ExtendLifetimeSharedDiffAction(repo, metrics);
  action.makePermanent("1").then(diff => {
    expect((repo.makePermanent as any).mock.calls.length).toBe(1);
    expect((repo.makePermanent as any).mock.calls[0][0]).toBe("1");
  })
});

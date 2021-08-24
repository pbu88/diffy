import {GetSharedDiffAction} from '../../src/v2/GetSharedDiffAction';
import {makeSharedDiff, makeSharedDiffWithId, SharedDiff} from '../../src/v2/SharedDiff';
import {SharedDiffRepository} from '../../src/v2/SharedDiffRepository';

import {metrics} from './MockedMetrics';

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
    fetchById: (id: string) => Promise.resolve({...makeSharedDiff(raw_diff), id}),
    deleteById: (id: string) => Promise.resolve(0),
    extendLifetime: (id: string, noOfDays: number) => Promise.reject('random err'),
    makePermanent: (id: string) => Promise.reject('random err'),
  };
  const action = new GetSharedDiffAction(repo, metrics);
  expect(action).toBeDefined();
  return action.getSharedDiff('<diff_id>').then(shared_diff => {
    expect(shared_diff.id).toEqual('<diff_id>');
    expect(shared_diff.diff).toBeDefined();
    expect(metrics.diffRetrievedSuccessfully).toHaveBeenCalled()
  });
});

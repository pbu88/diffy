import {GetSharedDiffAction} from '../../src/actions/GetSharedDiffAction';
import {makeSharedDiff } from '../../src/SharedDiff';
import { SharedDiff } from 'diffy-models';
import {SharedDiffRepository} from '../../src/sharedDiffRepository/SharedDiffRepository';

import {metrics} from '../MockedMetrics';

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
    update: (diff: SharedDiff) => Promise.reject('random err'),
    deleteExpired: jest.fn(),
  };
  const action = new GetSharedDiffAction(repo, {});
  expect(action).toBeDefined();
  return action.execute({id: '<diff_id>'}, {gaCookie: ""}).then(shared_diff => {
    expect(shared_diff.sharedDiff.id).toEqual('<diff_id>');
    expect(shared_diff.sharedDiff.rawDiff).toBeDefined();
    //expect(metrics.diffRetrievedSuccessfully).toHaveBeenCalled()
  });
});

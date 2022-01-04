import { Metrics } from '../metrics/Metrics';
import { SharedDiff } from "diffy-models";
import { SharedDiffRepository } from '../sharedDiffRepository/SharedDiffRepository';

export class GetSharedDiffAction {
  constructor(private repository: SharedDiffRepository, private metrics: Metrics) {}

  getSharedDiff(diff_id: string): Promise<SharedDiff> {
    return this.repository.fetchById(diff_id).then(result => {
      this.metrics.diffRetrievedSuccessfully();
      return result;
    });
  }
}

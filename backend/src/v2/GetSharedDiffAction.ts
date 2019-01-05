import { SharedDiff }           from './SharedDiff';
import { SharedDiffRepository } from './SharedDiffRepository';
import { Metrics }              from './Metrics';

export class GetSharedDiffAction {

    constructor(
            private repository: SharedDiffRepository,
            private metrics: Metrics) {}

    getSharedDiff(diff_id: string): Promise<SharedDiff> {
        return this.repository.fetchById(diff_id)
            .then(
                result => { this.metrics.diffRetrievedSuccessfully(); return result; }
            );
    }
}

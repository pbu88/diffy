import { isValidRawDiff, makeSharedDiff, SharedDiff } from './SharedDiff';
import { SharedDiffRepository } from './SharedDiffRepository';
import { Metrics } from './Metrics';

export class CreateSharedDiffAction {
    repository: SharedDiffRepository;
    metrics: Metrics;

    constructor(repository: SharedDiffRepository, metrics: Metrics) {
        this.repository = repository;
        this.metrics = metrics;
    }

    isValidRawDiff(raw_diff: string): boolean {
        return isValidRawDiff(raw_diff);
    }

    createSharedDiff(raw_diff: string): SharedDiff {
        return makeSharedDiff(raw_diff);
    }

    storeSharedDiff(shared_diff: SharedDiff): Promise<SharedDiff> {
        return this.repository.insert(shared_diff)
            .then(
                shared_diff => { this.registerSuccessfulCreation();  return shared_diff },
                error       => { this.registerFailedCreation(); return error })
    }

    protected registerSuccessfulCreation() {
        this.metrics.diffStoredSuccessfully();
    }
    protected registerFailedCreation() {
        this.metrics.diffFailedToStore();
    }

}

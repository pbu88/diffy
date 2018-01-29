import { makeSharedDiff, SharedDiff } from './SharedDiff';
import { SharedDiffRepository } from './SharedDiffRepository';

export class CreateSharedDiffAction {
    repository: SharedDiffRepository;

    constructor(repository: SharedDiffRepository) {
        this.repository = repository;
    }

    createSharedDiff(raw_diff: string): SharedDiff {
        return makeSharedDiff(raw_diff);
    }

    storeSharedDiff(shared_diff: SharedDiff): Promise<SharedDiff> {
        return this.repository.insert(shared_diff);
    }

}

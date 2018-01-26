import { makeSharedDiff, SharedDiff, SharedDiffRepository } from './SharedDiff';

export class CreateSharedDiffAction {
    repository: SharedDiffRepository;

    constructor(repository: SharedDiffRepository) {
        this.repository = repository;
    }

    createSharedDiff(raw_diff: string): SharedDiff {
        return makeSharedDiff(raw_diff);
    }

    storeSharedDiff(shared_diff: SharedDiff): SharedDiff {
        return this.repository.insert(shared_diff);
    }

}

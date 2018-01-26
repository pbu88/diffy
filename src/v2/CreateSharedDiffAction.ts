import { makeSharedDiff, SharedDiff, SharedDiffRepository } from './SharedDiff';

export class CreateSharedDiffAction {
    raw_diff: string;
    repository: SharedDiffRepository;

    constructor(raw_diff: string, repository: SharedDiffRepository) {
        this.repository = repository;
        this.raw_diff = raw_diff;
    }

    createSharedDiff(): SharedDiff {
        return makeSharedDiff(this.raw_diff);
    }

    storeSharedDiff(shared_diff: SharedDiff): SharedDiff {
        return this.repository.insert(shared_diff);
    }

}

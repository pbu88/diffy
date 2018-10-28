import { SharedDiff } from './SharedDiff';
import { SharedDiffRepository } from './SharedDiffRepository';

export class GetSharedDiffAction {
    diff_id: string;
    repository: SharedDiffRepository;

    constructor(repository: SharedDiffRepository) {
        this.repository = repository;
    }

    getSharedDiff(diff_id: string): Promise<SharedDiff> {
        return this.repository.fetchById(diff_id);
    }

}

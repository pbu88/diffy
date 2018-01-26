import { SharedDiffRepository } from './SharedDiff';

export class DeleteSharedDiffAction {
    repository: SharedDiffRepository;

    constructor(repository: SharedDiffRepository) {
        this.repository = repository;
    }

    deleteSharedDiff(diff_id: string): boolean {
        return this.repository.deleteById(diff_id);
    }

}

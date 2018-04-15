import { SharedDiffRepository } from './SharedDiffRepository';

export class DeleteSharedDiffAction {
    repository: SharedDiffRepository;

    constructor(repository: SharedDiffRepository) {
        this.repository = repository;
    }

    deleteSharedDiff(diff_id: string): Promise<number> {
        return this.repository.deleteById(diff_id);
    }

}

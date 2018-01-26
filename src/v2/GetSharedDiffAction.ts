import {  SharedDiff, SharedDiffRepository } from './SharedDiff';

export class GetSharedDiffAction {
    diff_id: string;
    repository: SharedDiffRepository;

    constructor(repository: SharedDiffRepository) {
        this.repository = repository;
    }

    getSharedDiff(diff_id: string): SharedDiff {
        return this.repository.fetchById(diff_id);
    }

}

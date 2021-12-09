import { SharedDiff } from "../SharedDiff";
import { SharedDiffRepository } from "../SharedDiffRepository";

export class DoubleWriteDiffRepository implements SharedDiffRepository {
    private masterRepo: SharedDiffRepository;
    private followerRepo: SharedDiffRepository;

    constructor(masterRepo: SharedDiffRepository, followerRepo: SharedDiffRepository) {
        this.masterRepo = masterRepo;
        this.followerRepo = followerRepo;
    }

    insert(diff: SharedDiff): Promise<SharedDiff> {
        const masterResult = this.masterRepo.insert(diff)
        masterResult.then(diff => {
            this.followerRepo.update(diff)
                .catch(err => console.trace(
                    `Failed to double insert diff with id ${diff.id}`,
                    JSON.stringify(err, null, '    ')))
        });
        return masterResult;
    }

    fetchById(id: string): Promise<SharedDiff> {
        return this.masterRepo.fetchById(id);
    }

    deleteById(id: string): Promise<number> {
        const masterResult = this.masterRepo.deleteById(id);
        masterResult.then(_ => {
            this.followerRepo.deleteById(id)
                .catch(err => console.trace(
                    `Failed to delete update diff with id ${id}`,
                    JSON.stringify(err, null, '    ')))
        });
        return masterResult;
    }

    update(diff: SharedDiff): Promise<SharedDiff> {
        const masterResult = this.masterRepo.update(diff);
        masterResult.then(diff => {
            this.followerRepo.update(diff)
                .catch(err => console.trace(
                    `Failed to double update diff with id ${diff.id}`,
                    JSON.stringify(err, null, '    ')))
        });
        return masterResult;
    }

    deleteExpired(): Promise<boolean> {
        const masterResult = this.masterRepo.deleteExpired();
        masterResult.then(primaryResult => {
            this.followerRepo.deleteExpired()
                .catch(err => console.trace(
                    `Failed to double delete expired diff`,
                    JSON.stringify(err, null, '    ')))
        });
        return masterResult;
    }

}
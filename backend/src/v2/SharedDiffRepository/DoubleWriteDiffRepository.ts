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
        masterResult
            .then(diff => this.followerRepo.update(diff))
            .catch(err => console.warn("Failed to double write diff with id", err));
        return masterResult;
    }

    fetchById(id: string): Promise<SharedDiff> {
        return this.masterRepo.fetchById(id);
    }

    deleteById(id: string): Promise<number> {
        const masterResult = this.masterRepo.deleteById(id);
        masterResult.then(_ => this.followerRepo.deleteById(id));
        return masterResult;
    }

    update(diff: SharedDiff): Promise<SharedDiff> {
        const masterResult = this.masterRepo.update(diff);
        masterResult.then(_ => this.followerRepo.update(diff));
        return masterResult;
    }

    deleteExpired(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}
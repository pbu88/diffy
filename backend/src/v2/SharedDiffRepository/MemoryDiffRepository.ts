import { SharedDiff } from "diffy-models";
import { SharedDiffRepository } from "../SharedDiffRepository";
const utils = require('../../utils.js').Utils;

export class MemoryDiffRepository implements SharedDiffRepository {
    private db: { [id: string]: SharedDiff } = {};

    constructor() {
        console.warn("Using a memory diff repositoy. This is not suitable for production");
    }

    insert(diff: SharedDiff): Promise<SharedDiff> {
        const id = utils.genRandomString()
        this.db[id] = { ...diff, id };
        return Promise.resolve(this.db[id]);
    }

    fetchById(id: string): Promise<SharedDiff> {
        const diff = this.db[id];
        if (diff == null) {
            return Promise.reject("not found");
        }
        return Promise.resolve({ ...diff });
    }

    deleteById(id: string): Promise<number> {
        return Promise.resolve(1);
    }

    update(diff: SharedDiff): Promise<SharedDiff> {
        if (diff.id == null) {
            return Promise.reject("diff was mising an id");
        }
        this.db[diff.id] = { ...diff };
        return Promise.resolve(this.db[diff.id]);
    }

    deleteExpired(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
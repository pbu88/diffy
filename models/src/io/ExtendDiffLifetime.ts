import { SharedDiff } from "../models";
import { Input, InputParser, Output } from "../ActionDefinitions";

export class ExtendDiffLifetimeInputFactory extends InputParser {

    public parse(req: any): ExtendDiffLifetimeInput {
        return {
            id: req.params.id,
        }
    }
}

export class ExtendDiffLifetimeInput implements Input {
    id: string;
}

export class ExtendDiffLifetimeOutput extends Output {
    private _sharedDiff: SharedDiff;

    constructor(sharedDiff: SharedDiff) {
        super();
        this._sharedDiff = sharedDiff;

    }

    public get sharedDiff(): SharedDiff {
        return this._sharedDiff;
    }

    public serialize(): string {
        return JSON.stringify(this.sharedDiff);
    }
}
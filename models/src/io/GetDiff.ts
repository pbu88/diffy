import { SharedDiff } from "../models";
import { Input, InputParser, Output } from "../ActionDefinitions";

export class GetDiffInputFactory extends InputParser {

    public parse(req: any): GetDiffInput {
        return {
            id: req.params.id,
        }
    }
}

export class GetDiffInput implements Input {
    id: string;
}

export class GetDiffOutput extends Output {
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
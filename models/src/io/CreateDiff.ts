import { SharedDiff } from "../models";
import { Input, InputParser, Output } from "../ActionDefinitions";

export class CreateDiffInputFactory extends InputParser {

    public parse(req: any): CreateDiffInput {
        let diffRequest = req.body;
        let diff: string = diffRequest.diff || '';
        diff = diff.replace(/\r/g, '');
        return {
            diff,
        }
    }
}

export class CreateDiffInput implements Input {
    diff: string;
}

export class CreateDiffOutput extends Output {
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
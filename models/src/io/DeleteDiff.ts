import { Input, InputParser, Output } from "../ActionDefinitions";

export class DeleteDiffInputFactory extends InputParser {

    public parse(req: any): DeleteDiffInput {
        return {
            id: req.params.id,
        }
    }
}

export class DeleteDiffInput implements Input {
    id: string;
}

export class DeleteDiffOutput extends Output {
    private _success: boolean;

    constructor(success: boolean) {
        super();
        this._success = success;

    }

    public get success(): boolean {
        return this._success;
    }

    public serialize(): string {
        return JSON.stringify(this._success);
    }
}
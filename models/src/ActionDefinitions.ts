export abstract class InputParser {
    public abstract parse (req: any): Input;
}
export abstract class Input {}


export class ContextParser {
    public parse (req: any): Context {
        return {
            gaCookie: this.readOrUndefined(() => req.cookies._ga),
        }
    }

    private readOrUndefined(getterFn: () => string): string | undefined {
        try {
            return getterFn()
        } catch {
            return undefined;
        }
    }
}

export interface Context {
    gaCookie: string | undefined;
}

export abstract class Output {
    public abstract serialize(): string;
}

export abstract class ActionFactory {
    public abstract create(): ActionPromise<Input, Context, Output>;
}

export abstract class Action<I extends Input, C extends Context, O extends Output> {
    public abstract execute(input: I, context: C): O;
}

export abstract class ActionPromise<I extends Input, C extends Context, O extends Output> {
    public abstract execute(input: I, context: C): Promise<O>;
}

import { InputParser, Context, Input, Output, ActionPromise, ContextParser } from 'diffy-models';

export function toMPromise(
    inputProvider: () => InputParser,
    contextProvider: () => ContextParser,
    actionProvider: () => ActionPromise<Input, Context, Output>) {

    return function (req: any, res: any) {
        const i = inputProvider(); // TODO: no need to create a new instance every time
        const c = contextProvider(); // TODO: no need to create a new instance every time
        const a = actionProvider(); // TODO: no need to create a new instance every time
        let request: Input
        let context: Context
        try {
            request = i.parse(req)
            context = c.parse(req);
        } catch (error) {
            console.log("Error while parsing arguments: " + error);
            res.status(400)
            res.send("error while parsing the request");
            return;
        }

        return a.execute(request, context).then(output => {
            res.status(200)
            res.json(output);
        }).catch(error => {
            console.log("Error while executing an action: " + error);
            res.status(500)
            res.send("oops, something went wrong ... ");
        });
    }
}
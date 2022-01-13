import { toMPromise } from "../../src/actions/ActionUtils";
import { MemoryDiffRepository } from "../../src/sharedDiffRepository/MemoryDiffRepository"
import { makeSharedDiff } from "../../src/SharedDiff";
import { ContextParser, GetDiffInputFactory, Output } from "diffy-models";
import { GetSharedDiffAction } from "../../src/actions/GetSharedDiffAction";

test("toM promise", () => {
    const rawDiff = `
        diff --git a/file.json b/file.json
        index 1456e89..e1da2da 100644
        --- a/file.json
        +++ b/file.json
        @@ -1,1 +1,1 @@
        -a
        +b
        `
    const sharedDiff = makeSharedDiff(rawDiff);
    const repo = new MemoryDiffRepository();
    return repo.insert(sharedDiff).then(storedDiff => {
        expect(storedDiff.id).not.toBeNull()
        let req = {
            params: { id: storedDiff.id }
        };
        let res = {
            status: jest.fn(statusCode => {}),
            json: jest.fn(output => {}),
            send: jest.fn(output => {}),
        }
        return toMPromise(() => new GetDiffInputFactory(), () => new ContextParser(), () => new GetSharedDiffAction(repo, {}))(req, res)
            .then(() => {
                expect(res.status.mock.calls.length).toBe(1);
                expect(res.json.mock.calls.length).toBe(1);
                expect(res.json.mock.calls[0][0].sharedDiff.id).toBe(storedDiff.id)
                expect(res.json.mock.calls[0][0].sharedDiff.rawDiff).toBe(rawDiff)
            });
    });
});
import { makeSharedDiff } from "../../../src/v2/SharedDiff";
import { MemoryDiffRepository } from "../../../src/v2/SharedDiffRepository/MemoryDiffRepository"

describe('MemorySharedDiffRepository tests', () => {
    it("should add items", () => {
        const raw_diff = `
            diff --git a/file.json b/file.json
            index 1456e89..e1da2da 100644
            --- a/file.json
            +++ b/file.json
            @@ -1,1 +1,1 @@
            -a
            +b
            `
        const shared_diff = makeSharedDiff(raw_diff);
        const repo = new MemoryDiffRepository();
        repo.insert(shared_diff).then(diff => expect(diff.id).not.toBeNull());
    })
});
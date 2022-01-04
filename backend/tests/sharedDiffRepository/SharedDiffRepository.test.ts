import { MemoryDiffRepository } from "../../src/sharedDiffRepository/MemoryDiffRepository";
import { getRepositorySupplierFor } from "../../src/sharedDiffRepository/SharedDiffRepository";
import { DoubleWriteDiffRepository } from "../../src/sharedDiffRepository/DoubleWriteDiffRepository";

describe("SharedDiffRepository", () => {
    it("getRepositorySupplierFor double write repo", () => {
        const config = {
            type: "double_write",
            primary: { type: "memory" },
            secondary: { type: "memory" },
        }
        expect(getRepositorySupplierFor(config)()).toBeInstanceOf(DoubleWriteDiffRepository)
    })
    it("getRepositorySupplierFor in memory repo", () => {
        const config = {
            type: "memory",
        }
        expect(getRepositorySupplierFor(config)()).toBeInstanceOf(MemoryDiffRepository)
    })
});
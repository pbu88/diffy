import { getRepositorySupplierFor } from "../sharedDiffRepository/SharedDiffRepository";
//var config = require('../config');
let config = {
    DIFF_REPO: {
        type: "google"
    }
}

function main() {
    const repo = getRepositorySupplierFor(config.DIFF_REPO)();
    repo.deleteExpired();
}

main();

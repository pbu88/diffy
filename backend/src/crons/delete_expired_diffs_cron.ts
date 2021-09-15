import { getRepositorySupplierFor } from "../v2/SharedDiffRepository";
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

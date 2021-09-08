import { getRepositorySupplierFor } from "../v2/SharedDiffRepository";
var config = require('../config');


function main() {
    const repo = getRepositorySupplierFor(config.DIFF_REPO)();
    repo.deleteExpired();
}

main();

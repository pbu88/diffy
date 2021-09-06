import { Datastore } from "@google-cloud/datastore";
import { GoogleDatastoreDiffRepository } from "../v2/SharedDiffRepository/GoogleDatastoreDiffRepository";

function main() {
    const repo = new GoogleDatastoreDiffRepository(new Datastore());
    repo.deleteExpired();
}

main();

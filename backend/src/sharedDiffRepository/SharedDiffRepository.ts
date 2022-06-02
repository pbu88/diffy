import mongodb = require('mongodb');
import { Datastore } from '@google-cloud/datastore';
import { SharedDiff } from "diffy-models";
import { DoubleWriteDiffRepository } from './DoubleWriteDiffRepository';
import { GoogleDatastoreDiffRepository } from './GoogleDatastoreDiffRepository';
import { buildDbUrl, MongoSharedDiffRepository } from './MongoSharedDiffRepository';
import { MemoryDiffRepository } from './MemoryDiffRepository';

export interface SharedDiffRepository {
  insert: (diff: SharedDiff) => Promise<SharedDiff>;
  fetchById: (id: string) => Promise<SharedDiff>;
  deleteById: (id: string) => Promise<number>;
  update(diff: SharedDiff): Promise<SharedDiff>;
  deleteExpired(): Promise<boolean>
}

/**
 * Returns a function that when invoked, will build a repository
 * @param config - a DIFF_REPO config object used to initialize the App
 * @returns a non-parametrized function to build a repository of said type
 */
export function getRepositorySupplierFor(config: any): () => SharedDiffRepository {
  if (config["type"] == "mongo") {
    return () => {
      const db_url = buildDbUrl(config["db_host"], config["db_port"]);
      const db_name = config["db_name"];
      const collection = mongodb.MongoClient.connect(db_url)
        .then(client => client.db(db_name))
        .then(db => db.collection(MongoSharedDiffRepository.COLLECTION_NAME))

      return new MongoSharedDiffRepository(collection);
    }

  } else if (config["type"] == "google") {
    return () => new GoogleDatastoreDiffRepository(new Datastore())

  } else if (config["type"] == "memory") {
    return () => new MemoryDiffRepository();

  } else if (config["type"] == "double_write") {
    return () => new DoubleWriteDiffRepository(
      getRepositorySupplierFor(config["primary"])(),
      getRepositorySupplierFor(config["secondary"])(),
    );
  }
  throw "unknown diff repo";
}
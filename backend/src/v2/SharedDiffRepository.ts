import { Datastore } from '@google-cloud/datastore';
import { SharedDiff } from './SharedDiff';
import { DoubleWriteDiffRepository } from './SharedDiffRepository/DoubleWriteDiffRepository';
import { GoogleDatastoreDiffRepository } from './SharedDiffRepository/GoogleDatastoreDiffRepository';
import { buildDbUrl, MongoSharedDiffRepository } from './SharedDiffRepository/MongoSharedDiffRepository';
import { MemoryDiffRepository } from './SharedDiffRepository/MemoryDiffRepository';

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
      const repo = new MongoSharedDiffRepository(db_url, config["db_name"]);
      repo.connect();
      return repo;
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
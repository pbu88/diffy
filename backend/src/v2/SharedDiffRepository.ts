import { Datastore } from '@google-cloud/datastore';
import {SharedDiff} from './SharedDiff';
import { GoogleDatastoreDiffRepository } from './SharedDiffRepository/GoogleDatastoreDiffRepository';
import { MongoSharedDiffRepository } from './SharedDiffRepository/MongoSharedDiffRepository';

export interface SharedDiffRepository {
  insert: (diff: SharedDiff) => Promise<SharedDiff>;
  fetchById: (id: string) => Promise<SharedDiff>;
  deleteById: (id: string) => Promise<number>;
  update(diff: SharedDiff): Promise<SharedDiff>;
  deleteExpired(): Promise<boolean>
}

/**
 * Returns a function that when invoked, will build a repository
 * @param type - a string defining the type of the repo: 'google', 'mongo'
 * @param config - a config object used to initialize the App
 * @returns a non-parametrized function to build a repository of said type
 */
export function getRepositorySupplierFor(type: string, config: any): () => SharedDiffRepository {
  if(type == "mongo") {
    return () => {
      const repo = new MongoSharedDiffRepository(config.db_url, config.db_name);
      repo.connect();
      return repo;
    }
  } else if (type == "google") {
    return () => new GoogleDatastoreDiffRepository(new Datastore())
  }
  throw "unknown diff repo";
}
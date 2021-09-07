// Imports the Google Cloud client library
import { Datastore } from '@google-cloud/datastore';

import { makeSharedDiffWithId, SharedDiff } from '../SharedDiff';
import { SharedDiffRepository } from '../SharedDiffRepository';
const utils = require('../../utils.js').Utils;

const ENTITY_NAME = 'diffy';  // maybe should be SharedDiff

export class GoogleDatastoreDiffRepository implements SharedDiffRepository {
  datastore: Datastore;

  constructor(datastore: Datastore) {
    this.datastore = datastore;
  }

  insert(diff: SharedDiff): Promise<SharedDiff> {
    const url_id = utils.genRandomString()
    const row = {
      url_id: url_id,
      rawDiff: diff.rawDiff,
      created: diff.created,
      expiresAt: diff.expiresAt
    }
    return this.datastore.save({
      key: this.datastore.key([ENTITY_NAME, url_id]),
      data: row,
      excludeFromIndexes: [
        'rawDiff', // important, otherwise google fails saying that is longer than 1500 bytes
      ],
    }).then(_ => ({ ...diff, id: url_id }));
  }

  /**
   * This method is more of an upsert really, it will update or inster if it doesn't exist.
   * @param diff - data to be updated
   * @returns 
   */
  update(diff: SharedDiff): Promise<SharedDiff> {
    const row = {
      url_id: diff.id,
      rawDiff: diff.rawDiff,
      created: diff.created,
      expiresAt: diff.expiresAt
    }
    return this.datastore.save({
      key: this.datastore.key([ENTITY_NAME, diff.id]),
      data: row,
      excludeFromIndexes: [
        'rawDiff', // important, otherwise google fails saying that is longer than 1500 bytes
      ],
    }).then(_ => (diff));
  }

  fetchById(id: string): Promise<SharedDiff> {
    const query = this.datastore.createQuery(ENTITY_NAME)
      .filter("url_id", "=", id)
      .limit(1);
    return this.datastore.runQuery(query)
      .then(diffys => diffys[0][0])
      .then(diffy => makeSharedDiffWithId(diffy.url_id, diffy.rawDiff, diffy.created, diffy.expiresAt));
  }

  // returns a promise of how many items where
  // deleted
  deleteById(id: string): Promise<number> {
    // can't seem to figure out how get the number of deletions from google datastore
    return this.datastore.delete(this.datastore.key(["diffy", id]))
      .then(() => 1);
  }

  deleteExpired(): Promise<boolean> {
    const query = this.datastore.createQuery(ENTITY_NAME)
      .filter("expiresAt", "<=", new Date())
    return this.datastore.runQuery(query)
      .then(diffys => diffys[0])
      .then(expiredDiffys => {
        return this.datastore.delete(expiredDiffys.map(d => d[this.datastore.KEY]));
      }).then(r => true);
  }
}

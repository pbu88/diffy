// Imports the Google Cloud client library
import { Datastore } from '@google-cloud/datastore';

import { makeSharedDiffWithId, SharedDiff } from '../SharedDiff';
import { SharedDiffRepository } from '../SharedDiffRepository';
const utils = require('../../utils.js').Utils;

const ENTITY_NAME = 'diffy';  // maybe should be SharedDiff
const MAX_DIFF_DATE = new Date('9999-01-01');

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
      key: this.datastore.key("diffy"),
      data: row
    }).then(_ => ({ ...diff, id: url_id }));
  }

  update(diff: SharedDiff): Promise<SharedDiff> {
    return null;
  }

  fetchById(id: string): Promise<SharedDiff> {
    const query = this.datastore.createQuery("diffy")
      .filter("url_id",  "=", id)
      .limit(1);
    return this.datastore.runQuery(query)
      .then(diffys => diffys[0][0])
      .then(diffy => makeSharedDiffWithId(diffy.url_id, diffy.rawDiff, diffy.created, diffy.expiresAt));
  }

  // returns a promise of how many items where
  // deleted
  deleteById(id: string): Promise<number> {
    return null;
  }
}

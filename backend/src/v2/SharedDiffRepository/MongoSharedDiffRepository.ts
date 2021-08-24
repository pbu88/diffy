import mongodb = require('mongodb');
import {makeSharedDiffWithId, SharedDiff} from '../SharedDiff';
import {SharedDiffRepository} from '../SharedDiffRepository';
const utils = require('../../utils.js').Utils;

const COLLECTION_NAME = 'diffy';  // maybe should be SharedDiff
const MAX_DIFF_DATE = new Date('9999-01-01');  

export class MongoSharedDiffRepository implements SharedDiffRepository {
  url: string;
  db_name: string;
  client: Promise<mongodb.MongoClient>;

  constructor(url: string, db_name: string) {
    this.url = url;
    this.db_name = db_name;
  }

  connect(): void {
    this.client = mongodb.MongoClient.connect(this.url);
  }

  disconnect(): void {
    this.client.then(client => client.close());
  }

  insert(diff: SharedDiff): Promise<SharedDiff> {
    return this.client.then(client => client.db(this.db_name))
        .then(db => db.collection(COLLECTION_NAME))
        .then(collection => collection.insertOne({...diff, _id: utils.genRandomString()}))
        .then(result => result.insertedId.toString())
        .then(id => ({...diff, id}));
  }

  fetchById(id: string): Promise<SharedDiff> {
    return this.client.then(client => client.db(this.db_name))
        .then(db => db.collection(COLLECTION_NAME))
        .then(collection => collection.findOne({'_id': id}))
        .then(doc => makeSharedDiffWithId(doc._id, doc.rawDiff, doc.created, doc.expiresAt));
  }

  extendLifetime(id: string, hours: number): Promise<SharedDiff> {
    return this.fetchById(id)
        .then(sharedDiff => new Date(sharedDiff.expiresAt.getTime() + (hours * 60 * 60 * 1000)))
        .then(
            newExpiredDate => {this.client.then(client => client.db(this.db_name))
                                   .then(db => db.collection(COLLECTION_NAME))
                                   .then(
                                       collection => collection.updateOne(
                                           {'_id': id}, {$set: {expiresAt: newExpiredDate}}))})
        .then(updateResult => this.fetchById(id));
  }

  makePermanent(id: string): Promise<SharedDiff> {
    return this.client.then(client => client.db(this.db_name))
      .then(db => db.collection(COLLECTION_NAME))
      .then(
        collection => collection.updateOne(
          { '_id': id }, { $set: { expiresAt: MAX_DIFF_DATE } }))
      .then(updateResult => this.fetchById(id));
  }

  // returns a promise of how many items where
  // deleted
  deleteById(id: string): Promise<number> {
    return this.client.then(client => client.db(this.db_name))
        .then(db => db.collection(COLLECTION_NAME))
        .then(collection => collection.deleteOne({'_id': id}))
        .then(result => result.deletedCount);
  }
}

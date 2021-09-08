import mongodb = require('mongodb');
import {makeSharedDiffWithId, SharedDiff} from '../SharedDiff';
import {SharedDiffRepository} from '../SharedDiffRepository';
const utils = require('../../utils.js').Utils;

const COLLECTION_NAME = 'diffy';  // maybe should be SharedDiff

export function buildDbUrl(host:string , port: string): string {
    return "mongodb://" + host + ":" + port + "/diffy";
}

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

  update(diff: SharedDiff): Promise<SharedDiff> {
    return this.client.then(client => client.db(this.db_name))
        .then(db => db.collection(COLLECTION_NAME))
        .then(collection => collection.replaceOne({_id: diff.id}, {
          rawDiff: diff.rawDiff,
          expiresAt: diff.expiresAt,
          created: diff.created
        }))
        .then(result => ({ ...diff }));
  }

  fetchById(id: string): Promise<SharedDiff> {
    return this.client.then(client => client.db(this.db_name))
        .then(db => db.collection(COLLECTION_NAME))
        .then(collection => collection.findOne({'_id': id}))
        .then(doc => makeSharedDiffWithId(doc._id, doc.rawDiff, doc.created, doc.expiresAt));
  }

  // returns a promise of how many items where
  // deleted
  deleteById(id: string): Promise<number> {
    return this.client.then(client => client.db(this.db_name))
        .then(db => db.collection(COLLECTION_NAME))
        .then(collection => collection.deleteOne({'_id': id}))
        .then(result => result.deletedCount);
  }

  deleteExpired(): Promise<boolean> {
    return this.client.then(client => client.db(this.db_name))
      .then(db => db.collection(COLLECTION_NAME))
      .then(collection => collection.deleteMany({ expiresAt: { '$lte': new Date } }))
      .then(result => { return true; /* success, TODO: add metrics in the future */ })
  }
}

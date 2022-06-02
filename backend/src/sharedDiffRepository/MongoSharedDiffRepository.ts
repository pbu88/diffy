import mongodb = require('mongodb');
import { SharedDiff } from "diffy-models";
import { makeSharedDiffWithId } from '../SharedDiff';
import { SharedDiffRepository} from './SharedDiffRepository';
const utils = require('../utils.js').Utils;

export function buildDbUrl(host:string , port: string): string {
    return "mongodb://" + host + ":" + port + "/diffy";
}

export class MongoSharedDiffRepository implements SharedDiffRepository {

  static COLLECTION_NAME: string = 'diffy';

  collection: Promise<mongodb.Collection>

  constructor(collection: Promise<mongodb.Collection>) {
    this.collection = collection;
  }

  insert(diff: SharedDiff): Promise<SharedDiff> {
    return this.collection
        .then(collection => collection.insertOne({...diff, _id: utils.genRandomString()}))
        .then(result => result.insertedId.toString())
        .then(id => ({...diff, id}));
  }

  update(diff: SharedDiff): Promise<SharedDiff> {
    return this.collection
        .then(collection => collection.replaceOne({_id: diff.id}, {
          rawDiff: diff.rawDiff,
          expiresAt: diff.expiresAt,
          created: diff.created
        }))
        .then(result => ({ ...diff }));
  }

  fetchById(id: string): Promise<SharedDiff> {
    return this.collection
        .then(collection => collection.findOne({'_id': id}))
        .then(doc => makeSharedDiffWithId(doc._id, doc.rawDiff, doc.created, doc.expiresAt));
  }

  // returns a promise of how many items where
  // deleted
  deleteById(id: string): Promise<number> {
    return this.collection
        .then(collection => collection.deleteOne({'_id': id}))
        .then(result => result.deletedCount);
  }

  deleteExpired(): Promise<boolean> {
    return this.collection
      .then(collection => collection.deleteMany({ expiresAt: { '$lte': new Date } }))
      .then(result => { return true; /* success, TODO: add metrics in the future */ })
  }
}

import mongodb = require('mongodb');
import {  SharedDiff } from './SharedDiff';

export interface SharedDiffRepository {
    insert: (diff: SharedDiff) => Promise<SharedDiff>;
    fetchById: (id: string) => Promise<SharedDiff>;
    deleteById: (id: string) => Promise<number>;
}

const COLLECTION_NAME = 'diffy'; // maybe should be SharedDiff

export class MongoSharedDiffRepository implements SharedDiffRepository {
    url: string;
    db_name: string;
    client: Promise<mongodb.MongoClient>;

    constructor(url: string, db_name: string) {
        this.url     = url;
        this.db_name = db_name;
    }

    connect(): void {
        this.client = mongodb.MongoClient.connect(this.url);
    }

    disconnect(): void {
        this.client.then(client => client.close());
    }

    insert(diff: SharedDiff): Promise<SharedDiff> {
        return this.client
            .then(client => client.db(this.db_name))
            .then(db => db.collection(COLLECTION_NAME))
            .then(collection => collection.insertOne(diff))
            .then(result => result.insertedId)
            .then(id => ({...diff, id: id.toHexString()}));
    }

    fetchById(id: string): Promise<SharedDiff> {
        return this.client
            .then(client => client.db(this.db_name))
            .then(db => db.collection(COLLECTION_NAME))
            .then(collection => collection.findOne({"_id": new mongodb.ObjectID(id)}))
            .then(doc => ({id: doc._id, ...doc}));
    }

    // returns a promise of how many items where deleted
    deleteById(id: string): Promise<number> {
        return this.client
            .then(client => client.db(this.db_name))
            .then(db => db.collection(COLLECTION_NAME))
            .then(collection => collection.deleteOne({"_id": new mongodb.ObjectID(id)}))
            .then(result => result.deletedCount);
    }
}

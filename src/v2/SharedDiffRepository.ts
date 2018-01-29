import mongodb = require('mongodb');
import {  SharedDiff } from './SharedDiff';

export interface SharedDiffRepository {
    insert: (diff: SharedDiff) => Promise<SharedDiff>;
    fetchById: (id: string) => Promise<SharedDiff>;
    deleteById: (id: string) => Promise<number>;
}

export class MongoSharedDiffRepository implements SharedDiffRepository {
    url: string;
    client: Promise<mongodb.MongoClient>;

    constructor(url: string) {
        this.url = url;
    }

    connect(): void {
        this.client = mongodb.MongoClient.connect(this.url);
    }

    disconnect(): void {
        this.client.then(client => client.close());
    }

    insert(diff: SharedDiff): Promise<SharedDiff> {
        return this.client
            .then(client => client.db('test'))
            .then(db => db.collection('diffy'))
            .then(collection => collection.insertOne(diff))
            .then(result => result.insertedId)
            .then(id => ({...diff, id: id.toHexString()}));
    }

    fetchById(id: string): Promise<SharedDiff> {
        return this.client
            .then(client => client.db('test'))
            .then(db => db.collection('diffy'))
            .then(collection => collection.findOne({"_id": new mongodb.ObjectID(id)}))
            .then(doc => ({id: doc._id, ...doc}));
    }

    // returns a promise of how many items where deleted
    deleteById(id: string): Promise<number> {
        return this.client
            .then(client => client.db('test'))
            .then(db => db.collection('diffy'))
            .then(collection => collection.deleteOne({"_id": new mongodb.ObjectID(id)}))
            .then(result => result.deletedCount);
    }
}

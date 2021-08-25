import * as config from './config.js';
import { MongoClient, Collection, Document } from 'mongodb';

const URL = config.db_url;
const COLLECTION = 'diffy';
const DB_NAME = 'diffy';

let diffy: Collection;

MongoClient.connect(URL, function(err, db) {
    diffy = db.db(DB_NAME).collection(COLLECTION);
});

export function getDiffById(id: string, callback: (doc: Document) => void) {
    diffy.findOne({ "_id": id }, function(err, doc) {
        callback(doc);
    });
}


var MongoCollection = require('./MongoCollection').MongoCollection;
/*
 * @param string url - the url of the db
 * @param string collectionName - the name of the collection
 */
export function SharedDiffMongoCollection(url, collectionName) {
    collectionName = collectionName || 'shared_diff';
    return MongoCollection(url, collectionName);
}


var MongoClientHelper = require('./MongoClientHelper').MongoClientHelper;
/*
 * @param string url - the url of the db
 * @param string collectionName - the name of the collection
 */
export function SharedDiffMongoCollection(url, collectionName) {
    collectionName = collectionName || 'shared_diff';
    var mongoClientHelper = MongoClientHelper(url, collectionName);

    /*
     * @param SharedDiff diff
     * @return Promise
     */
    function writeSharedDiff(diff) {
        return mongoClientHelper.insertOne(diff);
    }

    return {
        writeSharedDiff: writeSharedDiff
    };
}


var MongoClient = require('mongodb').MongoClient;

/*
 * @param string url - the url to connect to
 * @param string collection - collection name
 */
export function MongoClientHelper(url, collection) {
    /*
     * @return Promise
     */
    function connect () {
        return new Promise(function (fulfill, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) {
                    return reject(err);
                }
                return fulfill(db);
            });
        });
    }

    /*
     * @param object elem - the element to insert
     * @return Promise
     */
    function insertOne(elem) {
        return this.connect()
            .then(db => db.collection(collection))
            .then(collection => {
                return new Promise(function(fulfill, reject) {
                    collection.insertOne(elem, function (err, result) {
                        if (err) {
                            return reject(err);
                        }
                        return fulfill(result);
                    });
                });
            });
    }

    return {
        connect: connect,
        insertOne: insertOne
    };

}


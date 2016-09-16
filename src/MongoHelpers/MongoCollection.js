var MongoClient = require('mongodb').MongoClient;

/*
 * @param string url - the url to connect to
 * @param string collection - collection name
 */
export function MongoCollection(url, collection) {

    return {
        /*
         * @return Promise
         */
        connect: function() {
            return new Promise(function (fulfill, reject) {
                MongoClient.connect(url, function(err, db) {
                    if (err) {
                        return reject(err);
                    }
                    return fulfill(db);
                });
            });
        },

        /*
         * @param object elem - the element to insert
         * @return Promise
         */
        insertOne: function(elem) {
            return this.connect()
                .then(db => db.collection(collection))
                .then(collection => collection.insertOne(elem));
        },
        
        getOneById: function(id, callback) {
            return this.connect()
                .then(db => db.collection(collection))
                .then(collection => collection.findOne({"_id": id}));
        },

        removeById: function(id, callback) {
            return this.connect()
                .then(db => db.collection(collection))
                .then(collection => collection.deleteOne({"_id": id}));
        },

        deleteCollection: function() {
            return this.connect()
                .then(db => db.collection(collection))
                .then(collection => collection.remove({}));
        },
    };
}


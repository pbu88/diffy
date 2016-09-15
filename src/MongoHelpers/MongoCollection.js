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
        },
        
        getOneById: function(id, callback) {
            return this.connect()
                .then(db => db.collection(collection))
                .then(collection => {
                    return new Promise(function(fulfill, reject) {
                        collection.findOne({"_id": id}, function(err, doc) {
                            if(err) return reject(err);
                            return fulfill(doc);
                        });
                    });
                });
        },

        removeById: function(id, callback) {
            return this.connect()
                .then(db => db.collection(collection))
                .then(collection => {
                    return new Promise(function(fulfill, reject) {
                        collection.deleteOne({"_id": id}, function(err, doc) {
                            if(err) return reject(err);
                            return fulfill(doc);
                        });
                    });
                });
        },

        deleteCollection: function() {
            return this.connect()
                .then(db => db.collection(collection))
                .then(collection => collection.remove({}));
        },
    };
}


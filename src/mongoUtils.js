var Promise = require('promise');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var URL = 'mongodb://localhost:27017/diffy';
var COLLECTION = 'shared_diff';

var diffy;

MongoClient.connect(URL, function(err, db) {
    diffy = db.collection('diffy');
});

function _insertDocument(elem, callback) {
    diffy.insertOne(elem, function (err, result) {
        assert.equal(err, null);
        callback(result);
    });
}

function _getOneById(id, callback) {
    diffy.findOne({"_id": id}, function(err, doc) {
        callback(doc);
    });
}

function _removeById(id, callback) {
    diffy.deleteOne({"_id": id}, function(err, doc) {
        callback(doc);
    });
}

exports.insertDiff = function (diff, callback) {
    _insertDocument(diff, callback);
};

exports.getDiffById = function (id, callback) {
    var jsonDiff = null;
    _getOneById(id, callback);
    return jsonDiff;
};

exports.deleteDiffById = function (id, callback) {
    _removeById(id, callback);
};

/*
 * @param string url - the url to connect to
 * @return Promise
 */
function _connect(url) {
    return new Promise(function (fulfill, reject) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                return reject(err);
            }
            return fulfill(db.collection(COLLECTION));
        });
    });
}

/*
 * @param object elem - the element to insert
 * @return Promise
 */
function _insertDocumentPromise(elem) {
    return _connect(URL).
        then(diffyCollection => {
            return new Promise(function(fulfill, reject) {
                diffyCollection.insertOne(elem, function (err, result) {
                    if (err) {
                        return reject(err);
                    }
                    return fulfill(result);
                });
            });
            
        });
}

/*
 * @param SharedDiff diff
 * @return Promise
 */
export function writeSharedDiff(diff) {
    return _insertDocumentPromise(diff);
}

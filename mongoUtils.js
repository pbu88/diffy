var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/diffy';

var diffy;

MongoClient.connect(url, function(err, db) {
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

exports.insertDiff = function (diff, callback) {
    _insertDocument(diff, callback);
};

exports.getDiffById = function (id, callback) {
    var jsonDiff = null;
    _getOneById(id, callback);
    return jsonDiff;
};

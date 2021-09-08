var MongoClient = require('mongodb').MongoClient;
var config = require('../config');
var url = config.db_url; // legacy, this config is discontinued

function main() {
    var now = new Date;
    MongoClient.connect(url, function(err, db) {
        var diffy = db.collection('diffy');
        var cursor = diffy.find({}, { _id: 1, created: 1, expiresAt: 1 }).sort({ created: 1 });
        cursor.each(function(err, doc) {
            if (doc == null) {
                db.close();
                return;
            }
            if (!doc.created) {
                console.log("not created: " + doc._id);
                diffy.update({ _id: doc._id }, { '$set': { created: new Date } });
            }
            if (!doc.expiresAt) {
                console.log("not expiresAt: " + doc._id);
                diffy.update({ _id: doc._id }, { '$set': { expiresAt: new Date } });
            }
        });
    });
}

main();

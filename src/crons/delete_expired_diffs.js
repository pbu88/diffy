var MongoClient = require('mongodb').MongoClient;
var config = require('../config');
var url = config.db_url;

function main() {
    var now = new Date;
    MongoClient.connect(url, function(err, db) {
        var diffy = db.collection('diffy');
        diffy.remove({expiresAt: {'$lte' : new Date}})
            .then(() => db.close());
    });
}

main();

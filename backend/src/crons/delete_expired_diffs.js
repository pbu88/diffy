var MongoClient = require('mongodb').MongoClient;
var config = require('../config');
var url = config.db_url;

function main() {
    var now = new Date;
    MongoClient.connect(url, function(err, db) {
        var diffy = db.collection('diffy');
        diffy.deleteMany({ expiresAt: { '$lte': new Date } })
            .then(
                (result) => { /* success, TODO: add metrics in the future */ },
                (err) => { console.error(err) })
            .then(
                () => { db.close() });
    });
}

main();

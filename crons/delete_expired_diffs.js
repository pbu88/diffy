var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/diffy';

function main() {
    var now = new Date;
    MongoClient.connect(url, function(err, db) {
        var diffy = db.collection('diffy');
        diffy.remove({expiresAt: {'$lte' : new Date}});
        db.close();
    });
}

main();

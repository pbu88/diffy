var expect = require('chai').expect;
var testUtilities = require('../testUtilities/testUtilities.js');
var MongoCollection = require('../../src/MongoHelpers/MongoCollection').MongoCollection;
var SharedDiff = require('../../src/SharedDiff');
var config = require('../../src/config');

describe('MongoCollection', () => {
    var url = config.db_url;
    var collection = 'mongo_client_helper_test';
    var mongoCollection = MongoCollection(url, collection);

    before(() => {
        return mongoCollection.deleteCollection();
    });

    describe('#insertOne()', () => {
        it('should insert an element', () => {
            return mongoCollection.insertOne({test:1})
                .then(res => expect(res.result.ok).to.be.equal(1));
        });
    });
    
    describe('#getOneById()', () => {
        it('should retrieve an element by its id', () => {
            return mongoCollection.insertOne({test:10})
                .then(res => res.insertedId)
                .then(id => mongoCollection.getOneById(id))
                .then(res => expect(res.test).to.be.equal(10));
        });
    });
    
    describe('#removeById()', () => {
        it('should delete an element by its id', () => {
            return mongoCollection.insertOne({test:10})
                .then(res => res.insertedId)
                .then(id => mongoCollection.getOneById(id))
                .then(res => mongoCollection.removeById(res._id))
                .then(res => expect(res.deletedCount).to.be.equal(1));
        });
    });
});
    

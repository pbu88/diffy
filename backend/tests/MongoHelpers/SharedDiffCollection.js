var expect = require('chai').expect;
var testUtilities = require('../testUtilities/testUtilities.js');
var SharedDiffMongoCollection = require('../../src/MongoHelpers/SharedDiffMongoCollection').SharedDiffMongoCollection;
var SharedDiff = require('../../src/SharedDiff');
var config = require('../../src/config');

describe('SharedDiffMongoCollection', () => {
    
    var URL = config.db_url;
    var COLLECTION = 'shared_diff_test';
    var sharedDiffMongoCollection = SharedDiffMongoCollection(URL, COLLECTION);

    var readSharedDiff = testUtilities
        .readDiffFromFile('tests/testData/file.diff')
        .then(diff => new SharedDiff(diff));
    
    before(() => {
        return sharedDiffMongoCollection.deleteCollection();
    });

    describe('SharedDiffMongoCollection', () => {
        before(() => {
            return sharedDiffMongoCollection.deleteCollection();
        });

        describe('#insertOne', () => {
            it('save object in the db', () => {
                return readSharedDiff.then(sharedDiff => {
                    return sharedDiffMongoCollection.insertOne(sharedDiff)
                        .then(o => expect(o.insertedId).to.be.equal(sharedDiff._id));
                });
            });
        });
    });
});

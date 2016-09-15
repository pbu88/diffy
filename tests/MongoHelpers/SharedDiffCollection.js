var expect = require('chai').expect;
var testUtilities = require('../testUtilities/testUtilities.js');
var SharedDiffMongoCollection = require('../../src/MongoHelpers/SharedDiffMongoCollection').SharedDiffMongoCollection;
var SharedDiff = require('../../src/SharedDiff');

describe('SharedDiffMongoCollection', () => {
    
    var readSharedDiff = testUtilities
        .readDiffFromFile('tests/testData/file.diff')
        .then(diff => new SharedDiff(diff));

    describe('SharedDiffMongoCollection', () => {
        var URL = 'mongodb://localhost:27017/diffy';
        var COLLECTION = 'shared_diff_test';
        var sharedDiffMongoCollection = SharedDiffMongoCollection(URL, COLLECTION);
        describe('#writeSharedDiff', () => {
            it('save object in the db', () => {
                return readSharedDiff.then(sharedDiff => {
                    return sharedDiffMongoCollection.writeSharedDiff(sharedDiff)
                        .then(o => expect(o.insertedId).to.be.equal(sharedDiff._id));
                });
            });
        });
    });
});

var expect = require('chai').expect;
var testUtilities = require('./testUtilities/testUtilities.js');
var mongoUtils = require('../src/mongoUtils');
var SharedDiff = require('../src/SharedDiff');

describe('mongoUtils', () => {
    
    var readSharedDiff = testUtilities
        .readDiffFromFile('tests/testData/file.diff')
        .then(diff => new SharedDiff(diff));

    describe('#writeSharedDiff', () => {
        it('save object in the db', () => {
            return readSharedDiff.then(sharedDiff => {
                return mongoUtils.writeSharedDiff(sharedDiff)
                    .then(o => expect(o.insertedId).to.be.equal(sharedDiff._id));
            });
        });
    });
});

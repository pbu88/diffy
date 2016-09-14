var expect = require('chai').expect;
var testUtilities = require('./testUtilities/testUtilities.js');
var SharedDiff = require('../src/SharedDiff');

describe('SharedDiff', () => {
    var readDiff = testUtilities
        .readDiffFromFile('tests/testData/file.diff');

        describe('#SharedDiff()', () => {

            it('should set up all the necessary fields', () => {
                return readDiff.then(diff => {
                    var sharedDiff = new SharedDiff(diff);
                    expect(sharedDiff._id).to.exist;
                    expect(sharedDiff.diff).to.exist;
                    expect(sharedDiff.diff).to.be.deep.equal(diff);
                    expect(sharedDiff.createdAt).to.exist;
                    expect(sharedDiff.expiresAt).to.exist;
                });
            });
        });
});

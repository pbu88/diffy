var expect = require('chai').expect;
var testUtilities = require('./testUtilities/testUtilities.js');
var Diff2Html = require('diff2html').Diff2Html;
var Diff = require('../src/Diff').Diff;
var DiffFile = require('../src/Diff').DiffFile;

describe('Diff', () => {

    var readDiffFilePromise = testUtilities
        .readFile('tests/testData/file.diff');

    describe('#Diff()', () => {

        it('diff object should have rawDiffString field', () => {
            return readDiffFilePromise.then(diffText => {
                var diff = new Diff(diffText);
                expect(diff.rawDiff).to.exist;
            });
        });

        it('should generate array of two diff file objects', () => {
            return readDiffFilePromise.then(diffText => {
                var diff = new Diff(diffText);
                expect(diff.getFiles()).to.have.length(2);
                expect(diff.getFile(0)).to.be.instanceof(DiffFile);
                expect(diff.getFile(1)).to.be.instanceof(DiffFile);
            });
        });
    });

    describe('#getRawDiff()', () => {

        it('should return the raw diff text', () => {
            return readDiffFilePromise.then(diffText => {
                var diff = new Diff(diffText);
                expect(diff.getRawDiff()).to.be.equal(diffText);
            });
        });
    });

});

describe('DiffFile', () => {

    var readDiff = testUtilities
        .readDiffFromFile('tests/testData/file.diff')

    describe('#getDeletedLines()', () => {

        it('should return 0', () => {
            return readDiff.then(diff => {
                var diffFile = diff.getFile(0);
                expect(diffFile.getDeletedLines()).to.be.equal(0);
            });
        });

    });

    describe('#getAddedLines()', () => {

        it('should return 1', () => {
            return readDiff.then(diff => {
                var diffFile = diff.getFile(0);
                expect(diffFile.getAddedLines()).to.be.equal(1);
            });
        });

    });

    describe('#getNewFileName()', () => {

        it('should return package.json', () => {
            return readDiff.then(diff => {
                var diffFile = diff.getFile(0);
                expect(diffFile.getNewFileName()).to.be.equal('package.json');
            });
        });

    });

    describe('#getOldFileName()', () => {

        it('should return package.json', () => {
            return readDiff.then(diff => {
                var diffFile = diff.getFile(0);
                expect(diffFile.getOldFileName()).to.be.equal('package.json');
            });
        });

    });
});

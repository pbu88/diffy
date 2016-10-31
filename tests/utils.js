var expect = require('chai').expect;

describe('Utils module', () => {
    var Utils = require('../src/utils.js').Utils;

    describe('#getFileName()', () => {
        it('should return new name', () => {
            var file = {
                newName: 'newName',
                oldName: 'oldName'
            };
            expect(Utils.getFileName(file)).to.be.equals('newName');
        });
        it('should return old name if file is deleted', () => {
            var file = {
                newName: '/dev/null',
                oldName: 'oldName'
            };
            expect(Utils.getFileName(file)).to.be.equals('oldName');
        });
    });

    describe('#sortByFilenameCriteria()', () => {
        it('filename a is lower than filename b', () => {
            var file1 = {
                newName: 'a',
                oldName: 'a'
            };
            var file2 = {
                newName: 'b',
                oldName: 'b'
            };
            expect(Utils.sortByFilenameCriteria(file1, file2)).to.be.equals(-1);
        });
        it('filename b is greater than filename a', () => {
            var file1 = {
                newName: 'b',
                oldName: 'b'
            };
            var file2 = {
                newName: 'a',
                oldName: 'a'
            };
            expect(Utils.sortByFilenameCriteria(file1, file2)).to.be.equals(1);
        });
        
        it('files with same filename should be equal', () => {
            var file1 = {
                newName: 'b',
                oldName: 'b'
            };
            var file2 = {
                newName: 'b',
                oldName: 'b'
            };
            expect(Utils.sortByFilenameCriteria(file1, file2)).to.be.equals(0);
        });
    });

    describe('#genRandomString()', () => {
        it('should return a string of length equal to 24', () => {
            expect(Utils.genRandomString()).to.have.length(24);
        });

        it('should generate random strings', () => {
            // Generate two random strings and make sure they aren't the same
            var s1 = Utils.genRandomString();
            var s2 = Utils.genRandomString();
            expect(s1).not.to.be.equals(s2);
        });
    });

    describe('#isObjectEmpty()', () => {
        it('should return true for {}', () => {
            expect(Utils.isObjectEmpty({})).to.be.true;
        });
        
        it('should return false for non empty object', () => {
            expect(Utils.isObjectEmpty({x:1})).to.be.false;
        });
    });
    
    describe('#exceedsFileSizeLimit()', () => {
        it('should return true for files of size 1000001', () => {
            var file = {
                size: 1000001
            };
            expect(Utils.exceedsFileSizeLimit(file)).to.be.true;
        });
        
        it('should return false for files of size 1000000', () => {
            var file = {
                size: 1000000
            };
            expect(Utils.exceedsFileSizeLimit(file)).to.be.false;
        });
        
        it('should return false for files of size less than 999999', () => {
            var file = {
                size: 999999
            };
            expect(Utils.exceedsFileSizeLimit(file)).to.be.false;
        });
    });
});

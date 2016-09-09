var assert = require('assert');
describe('FileTree', () => {
    var FileTree = require('../src/treeFunctions.js').FileTree;
    describe('#new FileTree()', () => {
        var tree = new FileTree();
        it('path should be the root (/)', () => {
            assert.equal('/', tree.path);
        });
        it('should not have dirs', () => {
            assert.equal(0, tree.dirs.length);
        });
        it('should not have files', () => {
            assert.equal(0, tree.files.length);
        });
    });

    describe('#insert(\'test.txt\')', () => {
        var tree = new FileTree();
        tree.insert('test.txt');
        it('path should be the root (/)', () => {
            assert.equal('/', tree.path);
        });
        it('should not have any dirs', () => {
            assert.equal(0, tree.dirs.length);
        });
        it('should have one file', () => {
            assert.equal(1, tree.files.length);
        });
        it('should be named test.txt', () => {
            assert.equal('test.txt', tree.files[0].path);
        });
    });

    describe("#insert('test/test.txt')", () => {
        var tree = new FileTree();
        tree.insert('/test/test.txt');
        it('path should be the root (/)', () => {
            assert.equal('/', tree.path);
        });
        it('should have one dir', () => {
            assert.equal(1, tree.dirs.length);
        });
        it('should not have files', () => {
            assert.equal(0, tree.files.length);
        });
        it('should have one file in the subdir', () => {
            assert.equal(1, tree.dirs[0].files.length);
        });
        it('file should be named test.txt', () => {
            assert.equal('test.txt', tree.dirs[0].files[0].path);
        });
    });
    
    describe("#insert() multiple times", () => {
        var tree = new FileTree();
        tree.insert('dir/subdir/subsubdir/file.php');
        tree.insert('dir/subdir/subsubdir/file1.php');
        tree.insert('dir/subdir/subsubdir1/file.js');
        tree.insert('dir/subdir/subsubdir1/file1.js');
        it('root should have one dir', () => {
            assert.equal(1, tree.dirs.length);
        });
        it('root should have 0 files', () => {
            assert.equal(0, tree.files.length);
        });

        var subtree = tree.dirs[0];
        describe('subtree', () => {
            it('subtree should have two dirs', () => {
                assert.equal(2, subtree.dirs.length);
            });
            it('subtree should have 0 files', () => {
                assert.equal(0, subtree.files.length);
            });
            it('subtree path should be dir/subdir', () => {
                assert.equal('dir/subdir', subtree.path);
            });
        });
        
        var subsubtree = subtree.dirs[0];
        describe('subsubtree', () => {
            it('should have 0 dirs', () => {
                assert.equal(0, subsubtree.dirs.length);
            });
            it('should have 2 files', () => {
                assert.equal(2, subsubtree.files.length);
            });
            it('should have path equals to subsubdir', () => {
                assert.equal('subsubdir', subsubtree.path);
            });
            it('should have 2 files named file.php and file1.php', () => {
                assert.equal('file.php', subsubtree.files[0].path);
                assert.equal('file1.php', subsubtree.files[1].path);
            });
        });

        var subsubtree1 = subtree.dirs[1];
        describe('subsubtree1', () => {
            it('should have 0 dirs', () => {
                assert.equal(0, subsubtree1.dirs.length);
            });
            it('should have 2 files', () => {
                assert.equal(2, subsubtree1.files.length);
            });
            it('should have path equals to subsubdir1', () => {
                assert.equal('subsubdir1', subsubtree1.path);
            });
            it('should have 2 files named file.js and file1.js', () => {
                assert.equal('file.js', subsubtree1.files[0].path);
                assert.equal('file1.js', subsubtree1.files[1].path);
            });
        });
    });
    
    describe("#insert() multiple levels", () => {
        var tree = new FileTree();
        tree.insert('dir/subdir/file.py');
        tree.insert('dir/subdir/subsubdir/file2.py');
        tree.insert('dir/subdir/subsubdir/file3.py');
        tree.insert('dir/subdir/file4.py');
        tree.insert('dir/file5.py');
        tree.insert('dir/file6.py');
        tree.insert('dir/subdir/file7.py');
        tree.insert('dir/file8.py');
        tree.insert('dir/subdir/subsubdir/file9.py');
        
        var subtree0 = tree.dirs[0];
        it('subtree must have 3 files on level 0 dir', () => {
            assert.equal(3, subtree0.files.length);
        });
        
        var subtree1 = subtree0.dirs[0];
        it('subtree1 must have 3 files on level 1 dir', () => {
            assert.equal(3, subtree1.files.length);
        });


        var subtree2 = subtree1.dirs[0];
        it('subtree2 must have 3 files on level 2 dir', () => {
            assert.equal(3, subtree2.files.length);
        });

    });

    describe('#getFileName()', () => {
        var tree = new FileTree();
        tree.insert('/sub/file.txt');
        it('should return the full name for a file', () => {
            assert.equal('/sub/file.txt', tree.getFileName(tree.dirs[0].files[0]));
        });
    });
});

(function () {
    FileTree = require('../treeFunctions.js').FileTree;

    exports.testCreateTree = function(test) {
        test.expect(3);
        var tree = new FileTree();
        test.equal('/', tree.path);
        test.equal(0, tree.dirs.length);
        test.equal(0, tree.files.length);
        test.done();
    };

    exports.testInsertFile = function(test) {
        test.expect(4);
        var tree = new FileTree();
        tree.insert('test.txt');
        test.equal('/', tree.path);
        test.equal(0, tree.dirs.length, 'dirs must be empty');
        test.equal(1, tree.files.length, 'must be one file');
        test.equals('test.txt', tree.files[0].path, 'file names must be equals to test.txt');
        test.done();
    };

    exports.testInsertDir = function(test) {
        test.expect(5);
        var tree = new FileTree();
        tree.insert('/test/test.txt');
        test.equal('/', tree.path);
        test.equal(1, tree.dirs.length, 'dirs must be empty');
        test.equal(0, tree.files.length, 'must be no files');
        test.equal(1, tree.dirs[0].files.length, 'must one file in subdir files');
        test.equal('test.txt', tree.dirs[0].files[0].path, 'file names must be equals to test.txt');
        test.done();
    };

    exports.testInsertMultiple = function(test) {
        var tree = new FileTree();
        tree.insert('dir/subdir/subsubdir/file.php');
        tree.insert('dir/subdir/subsubdir/file1.php');
        tree.insert('dir/subdir/subsubdir1/file.php');
        tree.insert('dir/subdir/subsubdir1/file1.php');

        var subtree = tree.dirs[0];
        test.equal(1, tree.dirs.length);
        test.equal(0, tree.files.length);
        test.equal(2, subtree.dirs.length);
        test.equal(0, subtree.files.length);
        test.equal('dir/subdir', subtree.path);

        var subsubtree = subtree.dirs[0];
        test.equal(0, subsubtree.dirs.length);
        test.equal(2, subsubtree.files.length);
        test.equal('subsubdir', subsubtree.path);
        test.equal('file.php', subsubtree.files[0].path);
        test.equal('file1.php', subsubtree.files[1].path);

        var subsubtree1 = subtree.dirs[1];
        test.equal(0, subsubtree1.dirs.length);
        test.equal(2, subsubtree1.files.length);
        test.equal('subsubdir1', subsubtree1.path);
        test.equal('file.php', subsubtree1.files[0].path);
        test.equal('file1.php', subsubtree1.files[1].path);
        test.done();
    };

    exports.testInsertMultipleLevels = function(test){
        test.expect(3);
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

        tree = tree.dirs[0];
        test.equal(3, tree.files.length, 'must be 3 files on base tree');

        var subtree = tree.dirs[0];
        test.equal(3, subtree.files.length, 'must be 3 files on subtree');

        var subsubtree = subtree.dirs[0];
        test.equal(3, subsubtree.files.length, 'must be 3 files on subsubtree');

        test.done();
    };

    exports.testGetFileName = function(test) {
        var tree = new FileTree();
        tree.insert('/sub/file.txt');
        test.equal('/sub/file.txt', tree.getFileName(tree.dirs[0].files[0]));
        test.done();
    };
})();

treeFunction = require('../treeFunctions.js');

exports.testCreateTree = function(test) {
    test.expect(3);
    var tree = treeFunction.createTree();
    test.equal('/', tree.path);
    test.equal(0, tree.dirs.length);
    test.equal(0, tree.files.length);
    test.done();
};

exports.testInsertFile = function(test) {
    test.expect(4);
    var tree = treeFunction.createTree();
    treeFunction.insert(tree, 'test.txt');
    test.equal('/', tree.path);
    test.equal(0, tree.dirs.length, 'dirs must be empty');
    test.equal(1, tree.files.length, 'must be one file');
    test.equals('test.txt', tree.files[0].path, 'file names must be equals to test.txt');
    test.done();
};

exports.testInsertDir = function(test) {
    test.expect(5);
    var tree = treeFunction.createTree();
    treeFunction.insert(tree, '/test/test.txt');
    test.equal('/', tree.path);
    test.equal(1, tree.dirs.length, 'dirs must be empty');
    test.equal(0, tree.files.length, 'must be no files');
    test.equal(1, tree.dirs[0].files.length, 'must one file in subdir files');
    test.equal('test.txt', tree.dirs[0].files[0].path, 'file names must be equals to test.txt');
    test.done();
};

exports.testInsertMultiple = function(test) {
    tree = treeFunction.createTree();
    treeFunction.insert(tree, 'dir/subdir/subsubdir/file.php');
    treeFunction.insert(tree, 'dir/subdir/subsubdir/file1.php');
    treeFunction.insert(tree, 'dir/subdir/subsubdir1/file.php');
    treeFunction.insert(tree, 'dir/subdir/subsubdir1/file1.php');

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

exports.testGetFileName = function(test) {
    var tree = treeFunction.createTree();
    treeFunction.insert(tree, '/sub/file.txt');
    test.equal('/sub/file.txt', treeFunction.getFileName(tree.dirs[0].files[0])); 
    test.done();
}

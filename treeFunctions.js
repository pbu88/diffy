/* rough stuff, but for now I think will do */

function createTree() {
    return { parent: null, path: '/', files: [], dirs: [] };
}

function createLeaf(parent, filename) {
    return { parent: parent, path: filename };
}

function _getCommonPrefixIndex(pathSplit, dirs) {
    var l = Math.min(pathSplit.length, dirs.length);
    var i = 0;
    for(; i < l; i++){
        if (pathSplit[i] != dirs[i]){
            return i;
        }
    }
    return i;
}

function _insertAsSubtree(tree, dirs, file) {
    for (var i = 0; i < tree.dirs.length; i++) {
        var subtree = tree.dirs[i];
        var split = subtree.path.split('/');
        if (split[0] == dirs[0]) {
            _insert(subtree, dirs, file);
            return;
        }
    }
    // no common prefix, just insert
    var nTree = createTree();
    nTree.path = dirs.join('/');
    nTree.files.push(createLeaf(nTree, file));
    tree.dirs.push(nTree);
    nTree.parent = tree;
}

function _insert(tree, dirs, file) {
    if (dirs.length == 0) {
        tree.files.push(createLeaf(tree, file));
        return;
    }
    var pathSplit = tree.path.split('/');
    var i = _getCommonPrefixIndex(pathSplit, dirs);
    if (i < pathSplit.length && tree.path != '/') {
        // split at i
        tree_dirs = tree.dirs;
        tree_files = tree.files;
        var dirsSuffix = dirs.slice(i).join('/');  // new tree suffix
        var commonPrefix = dirs.slice(0, i);  // common prefix (array)

        var nSubTree = createTree(); 
        nSubTree.path = dirsSuffix;
        nSubTree.files.push(createLeaf(nSubTree, file));

        var convertedSubTree = createTree();
        convertedSubTree.path = pathSplit.slice(i).join('/');  // current tree suffix
        convertedSubTree.dirs = tree_dirs;
        convertedSubTree.files = tree_files;
        convertedSubTree.dirs.forEach(function(tree) {
            tree.parent = convertedSubTree;
        });
        convertedSubTree.files.forEach(function(leaf) {
            leaf.parent = convertedSubTree;
        });

        tree.path = commonPrefix.join('/');
        tree.dirs = [convertedSubTree, nSubTree];
        tree.files = [];
        
        // update parents
        convertedSubTree.parent = tree;
        nSubTree.parent = tree;
    }
    else {
        var slice = dirs.slice(i);
        if (slice.length == 0) {
            // same path, only insert file
            leaf = createLeaf(tree, file);
            tree.files.push(leaf);
        }
        else {
            // find the proper subdirectory to continue
            _insertAsSubtree(tree, slice, file);
        }
    }

}

function insert(tree, file) {
    if (file[0] != '/') {
        file = '/' + file;
    }
    var dirs = file.split('/');
    var file = dirs.pop();
    _insert(tree, dirs, file);
}

function getFileName(node) {
    res = node.path;
    while (node.parent !== null && node.parent.path != '/') {
        node = node.parent;
        res = node.path + '/' + res;
    }
    return '/' + res;
}

function printTree(tree, level) {
    var space = '';
    var spaceStr = '    ';
    for(var i=0; i<level; i++) space += spaceStr;
    var result = '';
    result += space + '<ul class="tree">\n';
    space = space + spaceStr;
    result += space + '<li>\n';
    result += space + '<span class="dir-name"><i class="fa fa-folder-open-o"></i>&nbsp;' + tree.path + '</span>\n';
    if (tree.dirs.length > 0) {
        tree.dirs.forEach(function(subtree) {
            result += printTree(subtree, level + 1);
        });
    }
    if (tree.files.length > 0) {
        result += space + '<ul class="files">\n';
        tree.files.forEach(function(file) {
            result += space + spaceStr;
            result += '<li>' +
                    '<a href="javascript:void(0);" title="' + getFileName(file) + '" class="file">\n' +
                        '<span class="file-name"><i class="fa fa-file-code-o"></i>&nbsp;' + file.path + '</span>\n' +
                    '</a>\n' + 
                '</li>';
        }); 
        result += space + '</ul>\n';
    }
    result += space + '</li>\n';
    space = '';
    for(var i=0; i<level; i++) space += spaceStr;
    result += space + '</ul>\n';
    return result;
}

exports.createTree = createTree;
exports.getFileName = getFileName;
exports.insert = insert;
exports.printTree = printTree;

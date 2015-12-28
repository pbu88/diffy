/* rough stuff, but for now I think will do
 *
 * Is basically a compressed TRIE datastructure where
 * the nodes represents members of the file system either
 * directories (subtrees) or files (leaves)
 *
 * */

(function () {

    function FileTree(parent, filename){
        this.parent = parent || null;
        this.path = filename || '/';
        this.files = [];
        this.dirs = [];
    }

    FileTree.prototype.createLeaf = function(parent, filename) {
        return new FileTree(parent, filename);
    };

    FileTree.prototype._getCommonPrefixIndex = function(pathSplit, dirs) {
        var l = Math.min(pathSplit.length, dirs.length);
        var i = 0;
        for(; i < l; i++){
            if (pathSplit[i] != dirs[i]){
                return i;
            }
        }
        return i;
    };

    FileTree.prototype._insertAsSubtree = function(dirs, file) {
        for (var i = 0; i < this.dirs.length; i++) {
            var subtree = this.dirs[i];
            var split = subtree.path.split('/');
            if (split[0] == dirs[0]) {
                subtree._insert(dirs, file);
                return;
            }
        }
        // no common prefix, just insert
        var nTree = new FileTree();
        nTree.path = dirs.join('/');
        nTree.files.push(this.createLeaf(nTree, file));
        this.dirs.push(nTree);
        nTree.parent = this;
    };

    FileTree.prototype._insert = function(dirs, file) {
        if (dirs.length === 0) {
            this.files.push(this.createLeaf(this, file));
            return;
        }
        var pathSplit = this.path.split('/');
        var i = this._getCommonPrefixIndex(pathSplit, dirs);
        if (i < pathSplit.length && this.path != '/') {
            // split at i
            tree_dirs = this.dirs;
            tree_files = this.files;

            var dirsSuffix = dirs.slice(i).join('/');  // new tree suffix
            var commonPrefix = dirs.slice(0, i);  // common prefix (array)


            var convertedSubTree = new FileTree();
            convertedSubTree.path = pathSplit.slice(i).join('/');  // current tree suffix
            convertedSubTree.dirs = tree_dirs;
            convertedSubTree.files = tree_files;
            convertedSubTree.dirs.forEach(function(tree) {
                tree.parent = convertedSubTree;
            });
            convertedSubTree.files.forEach(function(leaf) {
                leaf.parent = convertedSubTree;
            });

            this.path = commonPrefix.join('/');
            this.dirs = [convertedSubTree];
            this.files = [];

            // If the new subtree is a file
            if (dirsSuffix == ''){
                // Appending the new leaf
                leaf = this.createLeaf(this, file);
                this.files.push(leaf);
                return;
            }

            var nSubTree = new FileTree();
            nSubTree.path = dirsSuffix;
            nSubTree.files.push(this.createLeaf(nSubTree, file));

            // Adding the new dir
            this.dirs.push(nSubTree);

            // update parents
            convertedSubTree.parent = this;
            nSubTree.parent = this;
        }
        else {
            var slice = dirs.slice(i);
            if (slice.length == 0) {
                // same path, only insert file
                leaf = this.createLeaf(this, file);
                this.files.push(leaf);
            }
            else {
                // find the proper subdirectory to continue
                this._insertAsSubtree(slice, file);
            }
        }

    };

    FileTree.prototype.insert = function(file) {
        if (file[0] != '/') {
            file = '/' + file;
        }
        var dirs = file.split('/');
        file = dirs.pop();
        this._insert(dirs, file);
    };

    FileTree.prototype.getFileName = function(node) {
        res = node.path;
        while (node.parent !== null && node.parent.path != '/') {
            node = node.parent;
            res = node.path + '/' + res;
        }
        return '/' + res;
    };

    FileTree.prototype.printTree = function(tree, level) {
        var space = '';
        var spaceStr = '    ';
        for(var i=0; i<level; i++) space += spaceStr;
        var result = '';
        result += space + '<ul class="tree">\n';
        space = space + spaceStr;
        result += space + '<li>\n';
        result += space + '<a href="javascript:void(0);" class="directory directory-visible"><i class="fa fa-folder-open-o"></i><span class="dir-name">' + tree.path + '</span></a>\n';
        var that = this;
        if (tree.dirs.length > 0) {
            tree.dirs.forEach(function(subtree) {
                result += that.printTree(subtree, level + 1);
            });
        }
        if (tree.files.length > 0) {
            result += space + '<ul class="files">\n';
            tree.files.forEach(function(file) {
                var filename = that.getFileName(file);
                result += space + spaceStr;
                result += '<li>' +
                    '    <a href="javascript:void(0);" title="' + filename + '" class="file" data-filename="' + filename + '">\n' +
                    '        <i class="fa fa-file-code-o"></i><span class="file-name">' + file.path + '</span>\n' +
                    '    </a>\n' +
                    '</li>';
            });
            result += space + '</ul>\n';
        }
        result += space + '</li>\n';
        space = '';
        for(i=0; i<level; i++) space += spaceStr;
        result += space + '</ul>\n';
        return result;
    };

    module.exports.FileTree = FileTree;

})();


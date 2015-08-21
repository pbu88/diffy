(function (ctx, undefined) {

    function Utils() {
    }

    function _getFileName(file) {
        return file.newName == 'dev/null' ? file.oldName : file.newName;
    };

    Utils.prototype.getFileName = function (file) {
        return _getFileName(file);
    };

    Utils.prototype.sortByFilenameCriteria = function (file1, file2) {
        var fileName1 = _getFileName(file1);
        var fileName2 = _getFileName(file2);
        if (fileName1 > fileName2) return 1;
        if (fileName1 < fileName2) return -1;
        return 0;
    };

    Utils.prototype.genRandomString = function (files) {
        return (Math.random() + 1).toString(36).substring(2);
    };

    // expose this module
    ((typeof module !== 'undefined' && module.exports) ||
     (typeof exports !== 'undefined' && exports) ||
     (typeof window !== 'undefined' && window) ||
     (typeof self !== 'undefined' && self) ||
     (typeof $this !== 'undefined' && $this) ||
     Function('return this')())["Utils"] = new Utils();

})(this);


var ObjectID = require('mongodb').ObjectID;

(function () {

    function Utils() {
    }

    Utils.prototype.getFileName = function (file) {
        return file.newName == '/dev/null' ? file.oldName : file.newName;
    };

    Utils.prototype.sortByFilenameCriteria = function (file1, file2) {
        // instantiating here because this can be used as 
        // a callback and the meaning of this would be lost
        var utils = new Utils();
        var fileName1 = utils.getFileName(file1);
        var fileName2 = utils.getFileName(file2);
        if (fileName1 > fileName2) return 1;
        if (fileName1 < fileName2) return -1;
        return 0;
    };

    Utils.prototype.genRandomString = function () {
        return new ObjectID().toHexString();
    };

    Utils.prototype.isObjectEmpty = function (obj) {
        var name;
        for (name in obj ) {
            return false;
        }
        return true;
    };

    Utils.prototype.exceedsFileSizeLimit = function (multerFile) {
        // must be less than a megabyte
        return multerFile.size > 1000000;
    };

    Utils.prototype.createDiffObject = function (diff, jsonDiff) {
        var id = Utils.prototype.genRandomString();
        // create object
        var created = new Date();
        var expiresAt = new Date();
        expiresAt.setDate(created.getDate() + 1);
        var obj = {
            _id: id,
            diff:jsonDiff,
            rawDiff: diff,
            created: created,
            expiresAt: expiresAt,
        };
        return obj;
    };

    // expose this module
    module.exports.Utils = new Utils();

})();


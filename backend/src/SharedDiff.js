var Utils = require('./utils').Utils;

(function() {
    /*
     * This is the actual object that will be persisted in the db
     * @param Diff diff
     */
    function SharedDiff(diff) {
        var id = Utils.genRandomString();
        var createdAt = createdAt || new Date();
        var expiresAt = new Date();
        expiresAt.setDate(createdAt.getDate() + 1);

        this.diff = diff;
        this._id = id;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    module.exports = SharedDiff;
}());

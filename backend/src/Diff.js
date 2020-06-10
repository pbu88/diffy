var Diff2Html = require('diff2html').Diff2Html;
var _ = require('lodash');

(function() {
    /**
     * @param string rawDiffString -- the raw diff string
     */
    function Diff(rawDiffString) {

        /* Fields initialization */
        var jsonDiff = Diff2Html.getJsonFromDiff(rawDiffString);
        var diffFiles = _.map(jsonDiff, (jsonDiffFile) => {
            return new DiffFile(jsonDiffFile);
        });

        this.diffFiles = diffFiles;
        this.rawDiff = rawDiffString;

        /* Methods */

        /*
         * @return DiffFiles[] - the list of files
         */
        Diff.prototype.getFiles = function() {
            return this.diffFiles;
        };

        /*
         * @param int n - the index of the file
         * @return DiffFiles - the list of files
         */
        Diff.prototype.getFile = function(n) {
            return this.diffFiles[n];
        };

        /*
         * @return string - the raw diff text
         */
        Diff.prototype.getRawDiff = function() {
            return this.rawDiff;
        };
    }

    function DiffFile(jsonDiffFile) {

        /**
         * Example of a raw jsonDiffFile:
         * {
              "blocks": [
                {
                  "lines": [
                    {
                      "content": "     \"babel-cli\": \"^6.14.0\",",
                      "type": "d2h-cntx",
                      "oldNumber": 25,
                      "newNumber": 25
                    },
                    {
                      "content": "     \"babel-preset-es2015\": \"^6.14.0\",",
                      "type": "d2h-cntx",
                      "oldNumber": 26,
                      "newNumber": 26
                    },
                    {
                      "content": "     \"babel-preset-stage-0\": \"^6.5.0\",",
                      "type": "d2h-cntx",
                      "oldNumber": 27,
                      "newNumber": 27
                    },
                    {
                      "content": "+    \"chai\": \"^3.5.0\",",
                      "type": "d2h-ins",
                      "oldNumber": null,
                      "newNumber": 28
                    },
                    {
                      "content": "     \"mocha\": \"^3.0.2\"",
                      "type": "d2h-cntx",
                      "oldNumber": 28,
                      "newNumber": 29
                    },
                    {
                      "content": "   }",
                      "type": "d2h-cntx",
                      "oldNumber": 29,
                      "newNumber": 30
                    },
                    {
                      "content": " }",
                      "type": "d2h-cntx",
                      "oldNumber": 30,
                      "newNumber": 31
                    }
                  ],
                  "oldStartLine": "25",
                  "newStartLine": "25",
                  "header": "@@ -25,6 +25,7 @@"
                }
              ],
              "deletedLines": 0,
              "addedLines": 1,
              "checksumBefore": "a9f9716",
              "checksumAfter": "c0bdcfe",
              "mode": "100644",
              "oldName": "package.json",
              "language": "json",
              "newName": "package.json",
              "isCombined": false
            }
     */
        this.deletedLines = jsonDiffFile.deletedLines;
        this.addedLines = jsonDiffFile.addedLines;
        this.newFileName = jsonDiffFile.newName;
        this.oldFileName = jsonDiffFile.oldName;

        /* Methods */

        /*
         * @return int
         */
        DiffFile.prototype.getDeletedLines = function() {
            return this.deletedLines;
        };

        /*
         * @return int
         */
        DiffFile.prototype.getAddedLines = function() {
            return this.addedLines;
        };

        /*
         * @return string
         */
        DiffFile.prototype.getNewFileName = function() {
            return this.newFileName;
        };

        /*
         * @return string
         */
        DiffFile.prototype.getOldFileName = function() {
            return this.oldFileName;
        };

    }


    module.exports = {
        Diff: Diff,
        DiffFile: DiffFile
    };
}());

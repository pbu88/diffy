var fs = require('fs');
var Promise = require('promise');
var Diff = require('../../src/Diff').Diff;

export function readFile(filePath) {
    return new Promise(function(fulfill, reject){
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
            if (!err){
                return fulfill(data);
            } else {
                return reject(err);
            }
        });
    });
}

export function readDiffFromFile(filePath) {
    return readFile(filePath).then(diffText => new Diff(diffText));
}


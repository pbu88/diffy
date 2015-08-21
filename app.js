var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var diff2html = require('diff2html');
var fs = require('fs');
var utils = require('./utils.js').Utils;
var fileTree = require('./treeFunctions.js');
var app = express();

app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({
      extended: true
})); 

nunjucks.configure('templates', {
    autoescape: true,
    express: app
}).addGlobal('utils', utils);

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/:id', function (req, res) {
    res.send(req.params.id);
});

app.post('/new', function (req, res) {
    var diff = req.body.udiff;
    // remove \r
    var diff = diff.replace(/\r/g, '');
    var jsonDiff = diff2html.Diff2Html.getJsonFromDiff(diff);
    jsonDiff = jsonDiff.sort(utils.sortByFilenameCriteria);
    tree = fileTree.createTree();
    jsonDiff.forEach(function(e) {
        fileTree.insert(tree, utils.getFileName(e));
    });
    html = fileTree.printTree(tree, 0);
    
    res.render('diff.html', {
        diff: diff2html.Diff2Html.getPrettyHtmlFromJson(jsonDiff),
        fileTreeHtml: html,
        files: jsonDiff
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

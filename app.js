var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var diff2html = require('diff2html');
var fs = require('fs');
var utils = require('./utils.js').Utils;
var mongoUtils = require('./mongoUtils.js');
var fileTree = require('./treeFunctions.js');
var multer  = require('multer')

var upload = multer({ storage: multer.memoryStorage() })
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

app.get('/diff/:id', function (req, res) {
    var id = req.params.id;
    mongoUtils.getDiffById(id, function(row) {
        if (row === null) {
            res.status(404);
            res.send('404 Sorry, the requested page was not found');
            return;
        }
        var jsonDiff = row.diff;
        jsonDiff = jsonDiff.sort(utils.sortByFilenameCriteria);
        tree = fileTree.createTree();
        jsonDiff.forEach(function(e) {
            fileTree.insert(tree, utils.getFileName(e));
        });
        html = fileTree.printTree(tree, 0);

        res.render('diff.html', {
            id: id,
            diff: diff2html.Diff2Html.getPrettyHtmlFromJson(jsonDiff),
            fileTreeHtml: html,
            files: jsonDiff
        });
    });
});

app.post('/new', upload.single('diffFile'), function (req, res) {
    var diff = req.body.udiff;
    if (req.file) {
        diff = req.file.buffer.toString()
    }
    // remove \r
    var diff = diff.replace(/\r/g, '');
    var jsonDiff = diff2html.Diff2Html.getJsonFromDiff(diff);
    var id = utils.genRandomString();
    mongoUtils.insertDiff({_id: id, diff:jsonDiff}, function() {
        res.redirect('/diff/' + id);
    });
});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    mongoUtils.deleteDiffById(id, function () {
        res.redirect('/');
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

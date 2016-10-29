var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var diff2html = require('diff2html');
var fs = require('fs');
var utils = require('./utils.js').Utils;
var mongoUtils = require('./mongoUtils.js');
var FileTree = require('./treeFunctions.js').FileTree;
var multer  = require('multer');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('./config');

var upload = multer({ storage: multer.memoryStorage() });
var app = express();

app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({
      extended: true
}));

app.use(cookieParser('not-that-secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
    secret: 'not-that-secret'}));
app.use(flash());

var nunjucksEnv = nunjucks.configure('templates', {
    autoescape: true,
    express: app
});
nunjucksEnv.addGlobal('utils', utils);
nunjucksEnv.addGlobal('isProduction', function() {
    return app.get('env') == 'production';
});

app.get('/', function (req, res) {
    res.render('index.html',
            {'flash': req.flash()});
});

app.get('/diff/:id/download', function (req, res) {
    var id = req.params.id;
    mongoUtils.getDiffById(id, function(row) {
        if (row === null) {
            res.status(404);
            res.send('404 Sorry, the requested page was not found, create one at <a href="http://diffy.org">http://diffy.org</a>');
            return;
        }
        var rawDiff = row.rawDiff;
        res.setHeader('Content-disposition', 'attachment; filename=' + id + '.diff');
        res.setHeader('Content-type', 'text/plain');
        res.send(rawDiff);
    });
});

app.get('/diff/:id', function (req, res) {
    var id = req.params.id;
    mongoUtils.getDiffById(id, function(row) {
        if (row === null) {
            res.status(404);
            res.send('404 Sorry, the requested page was not found, create one at <a href="http://diffy.org">http://diffy.org</a>');
            return;
        }
        var jsonDiff = row.diff;
        jsonDiff = jsonDiff.sort(utils.sortByFilenameCriteria);
        tree = new FileTree();
        jsonDiff.forEach(function(e) {
            tree.insert(utils.getFileName(e));
        });
        html = tree.printTree(tree, 0);

        res.render('diff.html', {
            id: id,
            diff: diff2html.Diff2Html.getPrettyHtmlFromJson(jsonDiff),
            fileTreeHtml: html,
            files: jsonDiff,
            dbObj: row
        });
    });
});

app.post('/new', upload.single('diffFile'), function (req, res) {
    var diff = req.body.udiff;
    if (req.file) {
        if (utils.exceedsFileSizeLimit(req.file)) {
            req.flash('alert', 'File too big, sorry!');
            res.redirect('/');
            return;
        }
        diff = req.file.buffer.toString();
    }
    // remove \r
    diff = diff.replace(/\r/g, '');
    var jsonDiff = diff2html.Diff2Html.getJsonFromDiff(diff);
    if (utils.isObjectEmpty(jsonDiff)) {
        req.flash('alert', 'Not a valid diff');
        res.redirect('/');
        return;
    }
    var obj = utils.createDiffObject(diff, jsonDiff);
    mongoUtils.insertDiff(obj, function() {
        res.redirect('/diff/' + obj._id);
    });
});

app.post('/api/new', upload.single('diffFile'), function (req, res) {
    var diff = req.body.udiff;
    // remove \r
    if (!diff) {
        res.json({'status': 'error', 'message': 'udiff argument missing'});
        return;
    }
    diff = diff.replace(/\r/g, '');
    var jsonDiff = diff2html.Diff2Html.getJsonFromDiff(diff);
    if (utils.isObjectEmpty(jsonDiff)) {
        res.json({'status': 'error', 'message': 'Not a valid diff'});
        return;
    }
    var obj = utils.createDiffObject(diff, jsonDiff);
    mongoUtils.insertDiff(obj, function() {
        res.json({'status': 'success', 'url': 'http://diffy.org/diff/' + obj._id});
    });
});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    mongoUtils.deleteDiffById(id, function () {
        req.flash('success', 'Deleted successfully');
        res.redirect('/');
    });
});

var server = app.listen(config.port, config.host, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

app.use(function(err, req, res, next) {
      console.error(err.stack);
        res.status(500).send('Something broke!');
});

// Make sure we exit gracefully when we receive a SIGINT signal (eg. from Docker)
process.on('SIGINT', function() {
    process.exit();
});

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

import { MongoSharedDiffRepository } from './v2/SharedDiffRepository/MongoSharedDiffRepository';
import { GetSharedDiffAction } from './v2/GetSharedDiffAction';
import { CreateSharedDiffAction } from './v2/CreateSharedDiffAction';
import { CreateSharedDiffAPIAction } from './v2/CreateSharedDiffAPIAction';
import { DeleteSharedDiffAction } from './v2/DeleteSharedDiffAction';
import { SharedDiff } from './v2/SharedDiff';
//import { LogBasedMetrics } from './v2/Metrics/LogBasedMetrics';
import { GAMetrics } from './v2/Metrics/GAMetrics';

var upload = multer({ storage: multer.memoryStorage() });
var app = express();
const repo = new MongoSharedDiffRepository(config.db_url, config.db_name);
repo.connect();

if (! config.GA_ANALITYCS_KEY) {
    throw new Error("GA_ANALYTICS_KEY has to be present");
}

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

// Nunjuck setup
var nunjucksEnv = nunjucks.configure('templates', {
    autoescape: true,
    express: app
});
nunjucksEnv.addGlobal('utils', utils);
nunjucksEnv.addGlobal('config', config);
nunjucksEnv.addGlobal('isProduction', function() {
    return app.get('env') == 'production';
});

app.get('/', function (req: any, res: any) {
    res.render('index.html',
            {'flash': req.flash()});
});

app.get('/diff/:id/download', function (req: any, res: any) {
    var id = req.params.id;
    mongoUtils.getDiffById(id, function(row: any) {
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

app.get('/diff/:id', function (req: any, res: any) {
    var id = req.params.id;
    var action = new GetSharedDiffAction(repo);
    action.getSharedDiff(id)
        .then((shared_diff: SharedDiff) => {
            var jsonDiff = shared_diff.diff;
            jsonDiff = jsonDiff.sort(utils.sortByFilenameCriteria);
            var tree = new FileTree();
            jsonDiff.forEach(function(e) {
                tree.insert(utils.getFileName(e), e);
            });
            var html = tree.printTree(tree, 0);

            res.render('diff.html', {
                id: id,
                diff: diff2html.Diff2Html.getPrettyHtmlFromJson(jsonDiff),
                fileTreeHtml: html,
                files: jsonDiff,
                dbObj: shared_diff
            });
        },
        (err: any) => {
            res.status(404);
            res.send('404 Sorry, the requested page was not found, create one at <a href="http://diffy.org">http://diffy.org</a>');
        }
    );
});

app.post('/new', upload.single('diffFile'), function (req: any, res: any) {
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
    // end of param cleaning

    const metrics = new GAMetrics(config.GA_ANALITYCS_KEY, req.cookies._ga || config.GA_API_DEFAULT_KEY);
    const action = new CreateSharedDiffAction(repo, metrics);
    if(! action.isValidRawDiff(diff)) {
        req.flash('alert', 'Not a valid diff');
        res.redirect('/');
        return;
    }
    const shared_diff = action.createSharedDiff(diff);
    return action.storeSharedDiff(shared_diff)
        .then((obj: SharedDiff) => {
            if (!obj.id) {
                console.warn("new: undefined obj id");
            }
            res.redirect('/diff/' + obj.id)
        });

});

app.post('/api/new', upload.single('diffFile'), function (req: any, res: any) {
    var diff = req.body.udiff;
    // remove \r
    if (!diff) {
        res.json({'status': 'error', 'message': 'udiff argument missing'});
        return;
    }
    diff = diff.replace(/\r/g, '');

    const metrics = new GAMetrics(config.GA_ANALITYCS_KEY, config.GA_API_KEY);
    const action = new CreateSharedDiffAPIAction(repo, metrics);
    if(! action.isValidRawDiff(diff)) {
        res.json({'status': 'error', 'message': 'Not a valid diff'});
        return;
    }
    const shared_diff = action.createSharedDiff(diff);
    return action.storeSharedDiff(shared_diff)
        .then((obj: SharedDiff) => {
            if (!obj.id) {
                console.warn("api.new: undefined obj id");
            }
            res.json({'status': 'success', 'url': 'http://diffy.org/diff/' + obj.id});
        });
});

app.get('/delete/:id', function (req: any, res: any) {
    var id = req.params.id;
    const metrics = new GAMetrics(config.GA_ANALITYCS_KEY, req.cookies._ga || config.GA_API_DEFAULT_KEY);
    var action = new DeleteSharedDiffAction(repo, metrics);
    return action.deleteSharedDiff(id)
        .then(() => {
            req.flash('success', 'Deleted successfully');
            res.redirect('/');
        },
        (err: any) => {
            console.error(err);
            req.flash('alert', 'File not found');
            res.redirect('/');
        });
});


var server = app.listen(config.port, config.host, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App.ts listening at http://%s:%s', host, port);
});

app.use(function(err: any, req: any, res: any, next: any) {
      console.error(err.stack);
        res.status(500).send('Something broke!');
});

// Make sure we exit gracefully when we receive a SIGINT signal (eg. from Docker)
process.on('SIGINT', function() {
    repo.disconnect();
    process.exit();
});

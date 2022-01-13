var express = require('express');
var bodyParser = require('body-parser');
var utils = require('./utils.js').Utils;
var cookieParser = require('cookie-parser');
var path = require('path');

if (process.env["NODE_ENV"] == "production") {
  console.info("using config.js");
  var config = require('./config');
} else {
  console.info("using config_dev.js");
  var config = require('./config_dev');
}

const PROJECT_ROOT = path.join(__dirname + '/../../../');
const STATICS_FOLDER = path.join(PROJECT_ROOT, 'frontend/dist/ngdiffy');
const INDEX_FILE = path.join(PROJECT_ROOT + '/frontend/dist/ngdiffy/index.html');

import { GetSharedDiffAction } from './actions/GetSharedDiffAction';
import { CreateSharedDiffAction } from './actions/CreateSharedDiffAction';
import { DeleteSharedDiffAction } from './actions/DeleteSharedDiffAction';
import { ExtendLifetimeSharedDiffAction } from './actions/ExtendLifetimeSharedDiffAction';
import { ContextParser, CreateDiffInputFactory, DeleteDiffInputFactory, GetDiffInput, GetDiffInputFactory, SharedDiff } from "diffy-models";
import { getRepositorySupplierFor } from './sharedDiffRepository/SharedDiffRepository';
import { GAMetrics } from './metrics/GAMetrics';
import { toMPromise } from './actions/ActionUtils';

var app = express();
const repo = getRepositorySupplierFor(config.DIFF_REPO)();

if (!config.GA_ANALITYCS_KEY) {
  throw new Error('GA_ANALYTICS_KEY has to be present');
}

app.use('/assets', express.static(STATICS_FOLDER));
app.use('/', express.static(STATICS_FOLDER));
app.use(bodyParser.json({ limit: config.MAX_DIFF_SIZE }));
app.use(diffTooBigErrorHandler);

function diffTooBigErrorHandler(err: any, req: any, res: any, next: any) {
  if (err.type == 'entity.too.large') {
    res.status(400).send({ error: 'The diff is to big, the limit is ' + config.MAX_DIFF_SIZE })
  } else {
    next(err)
  }
}

app.use(cookieParser(config.session_secret)); // neded to read from req.cookie

let getDiffInputParserProvider = () => new GetDiffInputFactory();
let contextParserProvider = () => new ContextParser();
let getSharedDiffActionProvider = () => new GetSharedDiffAction(repo, config);

let createDiffInputParserProvider = () => new CreateDiffInputFactory();
let createDiffActionProvider = () => new CreateSharedDiffAction(repo, config);

let deleteDiffInputParserProvider = () => new DeleteDiffInputFactory();
let deleteDiffActionProvider = () => new DeleteSharedDiffAction(repo, config);

app.get('/api/diff/:id', toMPromise(getDiffInputParserProvider, contextParserProvider, getSharedDiffActionProvider))
app.put('/api/diff', toMPromise(createDiffInputParserProvider, contextParserProvider, createDiffActionProvider));
app.delete('/api/diff/:id', toMPromise(deleteDiffInputParserProvider, contextParserProvider, deleteDiffActionProvider));

app.get('/diff_download/:id', function (req: any, res: any) {
  var id = req.params.id;
  repo.fetchById(id)
    .then(diff => {
      if (diff === null) {
        res.status(404);
        res.send(
          '404 Sorry, the requested page was not found, create one at <a href="http://diffy.org">http://diffy.org</a>');
        return;
      }
      var rawDiff = diff.rawDiff;
      res.setHeader('Content-disposition', 'attachment; filename=' + id + '.diff');
      res.setHeader('Content-type', 'text/plain');
      res.send(rawDiff);
    });
});

app.post('/api/diff/extend/:id', function (req: any, res: any) {
  var id = req.params.id;
  const metrics =
    new GAMetrics(config.GA_ANALITYCS_KEY, req.cookies._ga || config.GA_API_DEFAULT_KEY);
  const action = new ExtendLifetimeSharedDiffAction(repo, metrics);
  return action
    .extendSharedDiffLifetime(id, 24)  // extend 24 hours
    .then(
      (obj: SharedDiff) => {
        if (!obj.id) {
          console.warn('new: undefined obj id');
        }
        res.send(obj);
      },
      (err: any) => {
        console.warn("Failed to extend diff lifetime:", err);
        res.status(400);
        res.send(JSON.stringify({ success: false, error: err.message }));
      });
});

app.post('/api/diff/makePermanent/:id', function (req: any, res: any) {
  var id = req.params.id;
  const metrics =
    new GAMetrics(config.GA_ANALITYCS_KEY, req.cookies._ga || config.GA_API_DEFAULT_KEY);
  const action = new ExtendLifetimeSharedDiffAction(repo, metrics);
  return action
    .makePermanent(id)
    .then(
      (obj: SharedDiff) => {
        if (!obj.id) {
          console.warn('new: undefined obj id');
        }
        res.send(obj);
      },
      (err: any) => {
        res.status(400);
        res.send(JSON.stringify({ success: false, error: err.message }));
      });
});

app.get('*', function (req: any, res: any) {
  res.sendFile(INDEX_FILE);
});

var server = app.listen(config.port, config.host, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App.ts listening at http://%s:%s', host, port);
});

app.use(function (err: any, req: any, res: any, next: any) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Make sure we exit gracefully when we receive a
// SIGINT signal (eg. from Docker)
process.on('SIGINT', function () {
  process.exit();
});

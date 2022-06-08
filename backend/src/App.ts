import { GetSharedDiffAction } from './actions/GetSharedDiffAction';
import { CreateSharedDiffAction } from './actions/CreateSharedDiffAction';
import { DeleteSharedDiffAction } from './actions/DeleteSharedDiffAction';
import { ExtendLifetimeSharedDiffAction } from './actions/ExtendLifetimeSharedDiffAction';
import { ContextParser, CreateDiffInputFactory, DeleteDiffInputFactory, ExtendDiffLifetimeInputFactory, GetDiffInput, GetDiffInputFactory, MakeDiffPermanentInputFactory, SharedDiff } from "diffy-models";
import { getRepositorySupplierFor } from './sharedDiffRepository/SharedDiffRepository';
import { GAMetrics } from './metrics/GAMetrics';
import { toMPromise } from './actions/ActionUtils';
import { MakePermanentSharedDiffAction } from './actions/MakePermanentSharedDiffAction';
import { ConfigFileResolver } from './utils/ConfigFileResolver';
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

const PROJECT_ROOT = path.join(__dirname + '/../../../');
const STATICS_FOLDER = path.join(PROJECT_ROOT, 'frontend/dist/ngdiffy');
const INDEX_FILE = path.join(PROJECT_ROOT + '/frontend/dist/ngdiffy/index.html');

var app = express();

var config_file = ConfigFileResolver.resolve(process.argv, process.env);
console.info(`Using config file: ${config_file}`)
var config = require(config_file);

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

const metricsProvider = (gaCookie: string) =>
  new GAMetrics(config.GA_ANALITYCS_KEY, gaCookie || config.GA_API_DEFAULT_KEY);
let contextParserProvider = () => new ContextParser();

app.get('/api/diff/:id', toMPromise(
  () => new GetDiffInputFactory(),
  contextParserProvider,
  () => new GetSharedDiffAction(repo, metricsProvider)))
app.put('/api/diff', toMPromise(
  () => new CreateDiffInputFactory(),
  contextParserProvider,
  () => new CreateSharedDiffAction(repo, metricsProvider)));
app.delete('/api/diff/:id', toMPromise(
  () => new DeleteDiffInputFactory(),
  contextParserProvider,
  () => new DeleteSharedDiffAction(repo, metricsProvider)));
app.post('/api/diff/makePermanent/:id', toMPromise(
  () => new MakeDiffPermanentInputFactory(),
  contextParserProvider,
  () => new MakePermanentSharedDiffAction(repo, metricsProvider)));
app.post('/api/diff/extend/:id', toMPromise(
  () => new ExtendDiffLifetimeInputFactory(),
  contextParserProvider,
  () => new ExtendLifetimeSharedDiffAction(repo, metricsProvider)));

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
app.get('*', function (req: any, res: any) { res.sendFile(INDEX_FILE); });

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

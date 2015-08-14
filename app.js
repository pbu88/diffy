var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser')
var diff2html = require('diff2html')
var fs = require('fs')
var app = express();

app.use(bodyParser.urlencoded({
      extended: true
})); 

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/:id', function (req, res) {
    res.send(req.params.id);
});

app.post('/new', function (req, res) {
    var diff = req.body.udiff;
    // removes \r
    diff = diff.replace(/\r/g, '');
    res.render('diff.html', {diff: diff2html.Diff2Html.getPrettyHtmlFromDiff(diff)});
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

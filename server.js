var fs = require('fs');
var es = require('elasticsearch');
var xnconfig = require('nodejsconfig');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
config = xnconfig.parse(process.env.NODE_ENV || 'development', data);
console.log("Env: " + config.env);
var esClient = new es.Client({host: config.elastic_host, log:'info'});
var db = new (require('./services/datastorage'))(esClient);
var express = require('express');
var app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan'),
    http = require('http');

var env = process.env.NODE_ENV || 'development';
app.enable('trust proxy');
app.set('port', process.env.PORT || 5000 /*config.port*/);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

app.get('/', function(req, res) {
  res.sendStatus(200);
});

//Pruebas
app.post('/market', function(req, res) {
  var market = req.body;
  db.saveMarket(market).then(function(data) {
      res.status(201).send(data);
  });
});
app.get('/market/name/:name', function(req, res) {
  db.searchMarketByName(req.params.name).then(
      function(data) {
          res.send(data);
      },
      function(error) {
          res.status(400).send(error);
      }
  ) ;
});

app.get('/market/address', function(req, res) {
    db.searchMarketByAddress(req.query.address, req.query.locale).then(
        function(data) {
            res.send(data);
        },
        function(error) {
            res.status(400).send(error);
        }
    ) ;
});

app.get('/market/geo', function(req, res) {
    db.searchMarketByGeo(req.query.lat, req.query.lon).then(
        function(data) {
            res.send(data);
        },
        function(error) {
            res.status(400).send(error);
        }
    ) ;
});

var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

server.on('error', function(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
});

var handleError = function(err, req, res, next) {
  next();
};
// development only
if (env === 'development') {
  app.use(handleError);
  app.use(errorHandler());
} else {
  app.use(handleError);
}
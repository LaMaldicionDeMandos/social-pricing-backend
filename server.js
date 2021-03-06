var fs = require('fs');
var xnconfig = require('nodejsconfig');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
config = xnconfig.parse(process.env.NODE_ENV || 'development', data);
console.log("Env: " + config.env);
var express = require('express');
var markets = require('./routes/markets');
var products = require('./routes/products');
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

app.use('/market', markets);
app.use('/product', products);

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
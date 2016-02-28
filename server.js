var fs = require('fs');
var xnconfig = require('nodejsconfig');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
config = xnconfig.parse(process.env.NODE_ENV || 'development', data);
console.log("Env: " + config.env);
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  res.sendStatus(200);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



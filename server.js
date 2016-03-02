var fs = require('fs');
var es = require('elasticsearch');
var xnconfig = require('nodejsconfig');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
config = xnconfig.parse(process.env.NODE_ENV || 'development', data);
console.log("Env: " + config.env);
var express = require('express');
var app = express();

var esClient = new es.Client({host: config.elastic_host, log:'info'});

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  /* Ejemplo de query en elastic search 
  esClient.search({
    index: 'market',
    body: {
      query: {
        match: {
          name: {
            query: 'Carefour Quilmes',
            fuzziness: "AUTO",
            operator: 'and'
          }
        }
      }
    }
  }).then(function (body) {
    console.log(JSON.stringify(body));
    var hits = body.hits.hits;
  }, function (error) {
    console.trace(error.message);
  });
  */
  res.sendStatus(200);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



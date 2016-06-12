/**
 * Created by boot on 6/12/16.
 */
var es = require('elasticsearch');
var esClient = new es.Client({host: 'localhost:9200', log:'info'});
var db = new (require('./services/datastorage'))(esClient);

var instance = {code: '1234567', market:'bbb', price:33.5};
db.saveProductInstance(instance).then(
    function(product) {
        console.log('success!! ' + JSON.stringify(product));
    },
    function(error) {
        console.log("Error :( --> " + error);
    }
);

/**
 * Created by boot on 6/12/16.
 */
var es = require('elasticsearch');
var esClient = new es.Client({host: 'localhost:9200', log:'info'});
var db = new (require('./services/datastorage'))(esClient);

db.searchProductInstancesByCode('1234567').then(
    function(instance) {
        console.log(JSON.stringify(instance));
    },
    function(error) {
        console.log("Error --> " + error);
    }
)

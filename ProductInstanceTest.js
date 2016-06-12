/**
 * Created by boot on 6/12/16.
 */
var es = require('elasticsearch');
var esClient = new es.Client({host: "localhost:9200", log:'info'});
var db = new (require('./services/datastorage'))(esClient);

db.searchProductInstanceByCodeAndMarket("1234567", "ccc").then(
    function(instances) {
        console.log(JSON.stringify(instances));
    },
    function(error) {
        console.log("Error --> " + error);
    }
);
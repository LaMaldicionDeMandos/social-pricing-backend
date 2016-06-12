/**
 * Created by boot on 6/12/16.
 */
var es = require('elasticsearch');
var esClient = new es.Client({host: 'localhost:9200', log:'info'});
var db = new (require('./services/datastorage'))(esClient);

var product = {code: '1234567', tradeMark:'Coca Cola', subtype:'Ligth', measure: 2.25, measureType:'lt',
description: 'Coca Cola Ligth 2.25lt'};
db.saveProduct(product).then(
    function(result) {
        console.log('success!! ' + JSON.stringify(result));
    },
    function(error) {
        console.log("Error :( --> " + error);
    }
);

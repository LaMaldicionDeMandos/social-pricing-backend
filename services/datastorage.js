/**
 * Created by boot on 3/18/16.
 */
var q = require('q');

function DB(esClient) {
    this.saveMarket = function(market) {
        var def = q.defer();
        esClient.create({index: 'market', type: 'Market', id: '1', body: market}).then(
            function(result) {
                market.id = result._id;
                def.resolve(market);
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };
}

module.exports = DB;

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
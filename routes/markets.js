/**
 * Created by boot on 4/15/16.
 */
var es = require('elasticsearch');
var esClient = new es.Client({host: config.elastic_host, log:'info'});
var db = new (require('../services/datastorage'))(esClient);
var marketService = new (require('../services/market_service'))(db);
exports.save = function(req, res) {
    var market = req.body;
    db.saveMarket(market).then(function(data) {
        res.status(201).send(data);
    });
};

exports.searchByName = function(req, res) {
    marketService.searchByName(req.params.name).then(
        function(data) {
            res.send(data);
        },
        function(error) {
            res.status(400).send(error);
        }
    ) ;
};
exports.searchByAddress = function(req, res) {
    marketService.searchByAddress(req.query.address, req.query.locale).then(
        function(data) {
            res.send(data);
        },
        function(error) {
            res.status(400).send(error);
        }
    ) ;
};
exports.searchByGeo = function(req, res) {
    marketService.searchByGeo(req.query.lat, req.query.lon).then(
        function(data) {
            res.send(data);
        },
        function(error) {
            res.status(400).send(error);
        }
    ) ;
};
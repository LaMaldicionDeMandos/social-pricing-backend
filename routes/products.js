/**
 * Created by boot on 6/14/16.
 */
var es = require('elasticsearch');
var esClient = new es.Client({host: config.elastic_host, log:'info'});
var db = new (require('../services/datastorage'))(esClient);
var productService = new (require('../services/product_service'))(db);
var router = require('express').Router();

var searchNear = function(req, res) {
    productService.searchProductsNearMarket(req.params.code, req.params.market).then(
        function(data) {
            if (data.spec) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
        },
        function(error) {
            res.status(400).send(error);
        }
    ) ;
};

router.get('/:code/market/:market', searchNear);

module.exports = router;
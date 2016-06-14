/**
 * Created by boot on 6/12/16.
 */
var q = require('q');
function Service(db) {
    this.searchInstances = function(code) {
        return db.searchProductInstancesByCode(code);
    };
    this.searchProductsNearMarket = function(code, marketId) {
        var def = q.defer();
        var product = {};
        var getSpec = function(spec) {
            var def = q.defer();
            product.spec = spec;
            def.resolve(product);
            return def.promise;
        };
        var getMarket = function(markets) {
            var def = q.defer();
            if (!markets || markets.length == 0) {
                def.reject();
            } else {
                def.resolve(markets[0]);
            }
            return def.promise;
        };

        var getNearProducts = function(markets) {

        }

        return def.promise;
    };
    this.searchOne = function(code) {
        var def = q.defer();
        db.searchProductByCode(code).then(
            function(products) {
                if(products.length > 0) {
                    def.resolve(products[0]);
                } else {
                    def.resolve(null);
                }
            },
            function(error) {
                def.reject(error);
            }
        );
        return def.promise;
    };
}

module.exports = Service;

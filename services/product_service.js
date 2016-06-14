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
        var result = {};
        var findMarket = function(instance, markets) {
            return markets[markets.findIndex(function(market) {
                return market.id == instance.marketId;
            })];
        };
        var findInstance = function(marketId, instances) {
            return instances[instances.findIndex(function(instance) {
                return instance.marketId == marketId;
            })];
        };
        q.all([this.searchOne(code), db.searchMarketById(marketId)]).done(function(values) {
            result.spec = values[0];
            db.searchMarketByGeoAndDistance(values[1].lat, values[1].lon, '10km').then(function(markets) {
                q.all(markets.map(function(market) {
                    return db.searchProductInstanceByCodeAndMarket(code, market.id);
                })).done(function(instances) {
                    instances = instances.map(function(arr) {
                            return arr[0];
                    });
                    instances.forEach(function(instance) {
                        instance.market = findMarket(instance, markets);
                    });
                    var theInstance = findInstance(marketId, instances);
                    instances.splice(instances.indexOf(theInstance), 1);
                    result.localProduct = theInstance;
                    result.near = instances;
                    def.resolve(result);
                });
            });
        });
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

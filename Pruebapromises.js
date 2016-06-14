/**
 * Created by boot on 6/13/16.
 */
var q = require('q');

var searchProduct = function(code) {
    var def = q.defer();
    setTimeout(function() {
        def.resolve({code: code});
    }, 800);
    return def.promise;
};

var searchMarket = function(marketId) {
    var def = q.defer();
    setTimeout(function() {
        def.resolve({id: marketId});
    }, 300);
    return def.promise;
};

var searchNear = function(market) {
    var def = q.defer();
    setTimeout(function() {
        def.resolve([market, {id:'ccc'}, {id: 'ddd'}]);
    }, 100);
    return def.promise;
};

var searchProductByMarket = function(code, marketId) {
    var def = q.defer();
    setTimeout(function() {
        def.resolve([{code:code, marketId: marketId}]);
    }, 200);
    return def.promise;
}

search = function(code, marketId) {
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
    q.all([searchProduct(code), searchMarket(marketId)]).done(function(values) {
        result.product = values[0];
        searchNear(values[1]).then(function(markets) {
            q.all(markets.map(function(market) {
                return searchProductByMarket(code, market.id);
            })).done(function(instances) {
                instances =
                instances.map(function(arr) {
                    return arr[0];
                });
                instances.forEach(function(instance) {
                    instance.market = findMarket(instance, markets);
                });
                var theInstance = findInstance(marketId, instances);
                result.instance = theInstance;
                result.instances = instances;
                def.resolve(result);
            });
        });
    });

    return def.promise;
};

search('aaa', 'bbb').then(function(product){console.log(JSON.stringify(product))});


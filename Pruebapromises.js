/**
 * Created by boot on 6/13/16.
 */
var q = require('q');
/*
var values = [0, 1, 2];

var map = function(value) {
    var def = q.defer();
    console.log('Map: ' + value);
    setTimeout(function() {
        var text;
        if (value == 0) text = 'zero';
        if (value == 1) text =  'one';
        if (value == 2) text = 'two';
        console.log('Map: ' + value + ' to ' + text);
        def.resolve(text);
    }, 500);
    return def.promise;
};

var getObject = function() {
    var def = q.defer();
    console.log('Get Object');
    setTimeout(function() {
        console.log('Call Get Object');
        def.resolve({});
    }, 1200);
    return def.promise;
};

var setName = function(object) {
    var def = q.defer();
    console.log('Set Name');
    setTimeout(function() {
        console.log('Call Set Name');
        object.name = 'name';
        def.resolve(object);
    }, 300);
    return def.promise;
};

var getValues = function(object) {
    var def = q.defer();
    console.log('Get Values');
    setTimeout(function() {
        console.log('Call Get Values');
        def.resolve({object: object, values:values});
    }, 800);
    return def.promise;
};

getObject().then(setName).then(getValues).then(function(object) {
    var def = q.defer();
    q.all(object.values.map(map)).done(function(v) {
        object.object.values = v;
        def.resolve(object.object);
    });
    return def.promise;
}).then(function(result) {
    console.log(JSON.stringify(result));
});
*/
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


/**
 * Created by boot on 6/12/16.
 */
var assert = require('assert');

describe('Product Service', function() {
    var shouldFail = false;
    var shouldReturn = [];
    var search = function (name) {
        return {
            then: function (success, error) {
                if (shouldFail) {
                    error('error');
                } else {
                    success(shouldReturn);
                }
                return this;
            }
        }
    };
    var dbMock = {
        searchProductInstancesByCode: search,
        searchProductByCode: search,
        searchProductInstanceByCodeAndMarket: search
    };
    var service = new (require('../services/product_service'))(dbMock);
    describe('Searching productInstances', function () {
        beforeEach(function() {
            shouldReturn.push({code:'aaa', makeUpdate: function(){}});
        });
        afterEach(function() {
            shouldReturn = [];
        });
        it('should return a list of product instances', function() {
            return service.searchInstances('aaa').then(
                function(instances) {
                    assert.equal(instances[0].code, 'aaa');
                },
                function() {
                    assert.fail();
                });
        });
    });
    describe('Searching productInstances near market', function () {
        var dbMock2, service;
        beforeEach(function() {
            dbMock2 = {
                searchMarketById: function(id) {
                    return {
                        then: function (success, error) {
                            success([{id: 'market1'}]);
                        }
                    };
                },
                searchMarketByGeoAndDistance: function(lat, lon, distance) {
                    return {
                        then: function (success, error) {
                            success([{id:'market1'},{id: 'market2'},{id: 'market3'}]);
                        }
                    };
                },
                searchProductByCode: function (code) {
                    return {
                        then: function (success, error) {
                            success([{code: 'product1'}]);
                        }
                    };
                },
                searchProductInstanceByCodeAndMarket: function (code, marketId) {
                    return {
                        then: function (success, error) {
                            if(marketId == 'market1')
                                success([{code: 'product1', marketId: 'market1', makeUpdate:function(){}}]);
                            else if (marketId == 'market2') {
                                success([{code: 'product1', marketId: 'market2', makeUpdate:function(){}}]);
                            } else {
                                success([{code: 'product1', marketId:'market3', makeUpdate:function(){}}]);
                            }
                            return this;
                        }
                    };
                }
            };
            service = new (require('../services/product_service'))(dbMock2);
        });
        it('should return a list of product instances', function() {
            return service.searchProductsNearMarket('product1', 'market1').then(
                function(product) {
                    assert.equal(product.spec.code, 'product1');
                    assert.equal(product.localProduct.market.id, 'market1');
                    assert.equal(product.near.length, 2);
                    assert.equal(product.near[0].market.id, 'market2');
                    assert.equal(product.near[1].market.id, 'market3');
                },
                function() {
                    assert.fail();
                });
        });
    });
    describe('Search product', function () {
        describe('found a product', function(){
            beforeEach(function() {
                shouldReturn.push({code:'aaa'});
            });
            afterEach(function() {
                shouldReturn = [];
            });
            it('should return a product', function() {
                return service.searchOne('aaa').then(
                    function(product) {
                        assert.equal(product.code, 'aaa');
                    },
                    function() {
                        assert.fail();
                    });
            });
        });
        describe('not found a product', function(){
            it('should return null', function() {
                return service.searchOne('aaa').then(
                    function(product) {
                        assert.equal(product, null);
                    },
                    function() {
                        assert.fail();
                    });
            });
        });
    });
});
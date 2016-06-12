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
            }
        }
    };
    var dbMock = {
        searchProductInstancesByCode: search,
        searchProductByCode: search
    };
    var service = new (require('../services/product_service'))(dbMock);
    describe('Searching productInstances', function () {
        beforeEach(function() {
            shouldReturn.push({code:'aaa'});
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
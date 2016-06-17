/**
 * Created by boot on 6/17/16.
 */
var ProductInstance = require('../model/model').ProductInstance;
var assert = require('assert');
var original

describe("ProductInstance", function() {
    describe('Last Update', function() {
        describe('if there are a difference of seconds', function() {
            var dto = {lastUpdate: new Date(2016, 6, 17, 11, 3, 34)};
            var now = new Date(2016, 6, 17, 11, 3, 38);
            var product = new ProductInstance(dto);
            it('should generate 4 seconds', function() {
                product.makeUpdate(now)
                assert.equal(product.updateValue, 4);
                assert.equal(product.updateUnit, 's');
            });
        });
        describe('if there are a difference of minutes', function() {
            var dto = {lastUpdate: new Date(2016, 6, 17, 11, 58, 34)};
            var now = new Date(2016, 6, 17, 12, 3, 38);
            var product = new ProductInstance(dto);
            it('should generate 5 minutes', function() {
                product.makeUpdate(now)
                assert.equal(product.updateValue, 5);
                assert.equal(product.updateUnit, 'm');
            });
        });
        describe('if there are a difference of hours', function() {
            var dto = {lastUpdate: new Date(2016, 6, 17, 11, 58, 34)};
            var now = new Date(2016, 6, 17, 15, 3, 38);
            var product = new ProductInstance(dto);
            it('should generate 3 hours', function() {
                product.makeUpdate(now)
                assert.equal(product.updateValue, 3);
                assert.equal(product.updateUnit, 'h');
            });
        });
        describe('if there are a difference of days', function() {
            var dto = {lastUpdate: new Date(2016, 6, 17, 11, 58, 34)};
            var now = new Date(2016, 6, 20, 15, 3, 38);
            var product = new ProductInstance(dto);
            it('should generate 3 days', function() {
                product.makeUpdate(now)
                assert.equal(product.updateValue, 3);
                assert.equal(product.updateUnit, 'd');
            });
        });
    })
});
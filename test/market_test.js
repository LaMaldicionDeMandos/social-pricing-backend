/**
 * Created by boot on 4/16/16.
 */
var Market = require('../model/model').Market;
var assert = require('assert');

describe('Market', function() {
    describe('normalize address Av', function() {
        it('should normalize Avenida', function() {
            var normalized = Market.normalizeAddress('Avenida la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
        it('should normalize avenida', function() {
            var normalized = Market.normalizeAddress('avenida la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
        it('should normalize AV.', function() {
            var normalized = Market.normalizeAddress('AV. la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
        it('should normalize AV', function() {
            var normalized = Market.normalizeAddress('AV la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
        it('should normalize Av.', function() {
            var normalized = Market.normalizeAddress('Av. la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
        it('should normalize Av', function() {
            var normalized = Market.normalizeAddress('Av la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
        it('should normalize av.', function() {
            var normalized = Market.normalizeAddress('av. la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
        it('should normalize av', function() {
            var normalized = Market.normalizeAddress('av la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
    });
    describe('Normalize to lower case', function() {
        it('should normalize lowercase', function() {
            var normalized = Market.normalizeAddress('av La Plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
    });
    describe('Normalize number to 100 multiple', function() {
        it('should normalize 100 multiple', function() {
            var normalized = Market.normalizeAddress('av. la plata 15500');
            assert.equal(normalized, 'av. la plata 15500');
        });
        it('should normalize 100', function() {
            var normalized = Market.normalizeAddress('av. la plata 100');
            assert.equal(normalized, 'av. la plata 100');
        });
        it('should normalize less than 100', function() {
            var normalized = Market.normalizeAddress('av. la plata 68');
            assert.equal(normalized, 'av. la plata 00');
        });
        it('should normalize less than 10', function() {
            var normalized = Market.normalizeAddress('av. la plata 8');
            assert.equal(normalized, 'av. la plata 00');
        });
        it('should normalize greater than 100', function() {
            var normalized = Market.normalizeAddress('av. la plata 350');
            assert.equal(normalized, 'av. la plata 300');
        });
        it('should normalize greater than 1000', function() {
            var normalized = Market.normalizeAddress('av. la plata 15555');
            assert.equal(normalized, 'av. la plata 15500');
        });
    });
});
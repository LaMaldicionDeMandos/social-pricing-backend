/**
 * Created by boot on 3/19/16.
 */
var assert = require('assert');

describe('Market Service', function() {
    var shouldFail = false;
    var shouldReturn = [];
    var search = function(name) {
        return {
            then: function(success, error) {
                if(shouldFail) {
                    error('error');
                } else {
                    success(shouldReturn);
                }
            }
        }
    };
    var dbMock = {
        searchMarketByName: search,
        searchMarketByAddress: search,
        searchMarketByGeo: search
    };
    var service = new (require('../services/market_service'))(dbMock);
    describe('Searching markets', function() {
        describe('Search markets and fail', function() {
            beforeEach(function() {
                shouldFail = true;
            });
            it('When search by name should fail', function() {
                return service.searchByName('name').then(
                    function(markets) {
                        assert.ok(false);
                    },
                    function(err) {
                        assert.equal(err,'error');
                    });
            });
            it('when search by address should fail', function() {
                return service.searchByAddress('address', 'locale').then(
                    function(markets) {
                        assert.ok(false);
                    },
                    function(err) {
                        assert.equal(err, 'error');
                    });
            });
            it('when search by geo should fail', function() {
                return service.searchByGeo('-13', '-58').then(
                    function(markets) {
                        assert.ok(false);
                    },
                    function(err) {
                        assert.equal(err, 'error');
                    });
            });
        });
        describe('Search markets and not found results', function() {
            beforeEach(function() {
                shouldFail = false;
                shouldReturn = [];
            });
            it('When search by name should return an empty array', function() {
                return service.searchByName('name').then(
                    function(markets) {
                        assert.equal(markets, shouldReturn);
                    },
                    function() {
                        assert.ok(false);
                    });
            });
            it('when search by address should return an empty array', function() {
                return service.searchByAddress('address', 'locale').then(
                    function(markets) {
                        assert.equal(markets, shouldReturn);
                    },
                    function() {
                        assert.ok(false);
                    });
            });
            it('when search by geo should return an empty array', function() {
                return service.searchByGeo('13', '13').then(
                    function(markets) {
                        assert.equal(markets, shouldReturn);
                    },
                    function() {
                        assert.ok(false);
                    });
            });
        });
        describe('Search markets and return some', function() {
            beforeEach(function() {
                shouldFail = false;
                shouldReturn = [{
                    "id": "a21e01a3-8913-4fc5-a777-3bbd3027396b",
                    "name": "Crrefour",
                    "address": "Av. La plata 15555",
                    "normalizedAddress": "av. la plata 15555",
                    "locale": "Quilmes Oeste",
                    "geo": {
                        "lat": -34.1667,
                        "lon": -58.1144
                    }
                }];
            });
            it('When search by name should return an array', function() {
                return service.searchByName('name').then(
                    function(markets) {
                        assert.equal(markets[0].id, 'a21e01a3-8913-4fc5-a777-3bbd3027396b');
                        assert.equal(markets[0].name, 'Crrefour');
                        assert.equal(markets[0].address, 'Av. La plata 15555');
                        assert.equal(markets[0].normalizedAddress, 'av. la plata 15555');
                        assert.equal(markets[0].locale, 'Quilmes Oeste');
                        assert.equal(markets[0].geo.lat, -34.1667);
                        assert.equal(markets[0].geo.lon, -58.1144);
                    },
                    function() {
                        assert.ok(false);
                    });
            });
            it('when search by address should return an array', function() {
                return service.searchByAddress('address', 'locale').then(
                    function(markets) {
                        assert.equal(markets[0].id, 'a21e01a3-8913-4fc5-a777-3bbd3027396b');
                        assert.equal(markets[0].name, 'Crrefour');
                        assert.equal(markets[0].address, 'Av. La plata 15555');
                        assert.equal(markets[0].normalizedAddress, 'av. la plata 15555');
                        assert.equal(markets[0].locale, 'Quilmes Oeste');
                        assert.equal(markets[0].geo.lat, -34.1667);
                        assert.equal(markets[0].geo.lon, -58.1144);
                    },
                    function() {
                        assert.ok(false);
                    });
            });
            it('when search by geo should return an array', function() {
                return service.searchByGeo("-34.1667", "-58.1144").then(
                    function(markets) {
                        assert.equal(markets[0].id, 'a21e01a3-8913-4fc5-a777-3bbd3027396b');
                        assert.equal(markets[0].name, 'Crrefour');
                        assert.equal(markets[0].address, 'Av. La plata 15555');
                        assert.equal(markets[0].normalizedAddress, 'av. la plata 15555');
                        assert.equal(markets[0].locale, 'Quilmes Oeste');
                        assert.equal(markets[0].geo.lat, -34.1667);
                        assert.equal(markets[0].geo.lon, -58.1144);
                    },
                    function() {
                        assert.ok(false);
                    });
            });
        });
    }) ;
});
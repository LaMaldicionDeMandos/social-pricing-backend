var assert = require('assert');
var sinon = require('sinon');
var should = require('should');

var shouldFail;
var shouldReturnSome;

var esMock = {
    indices: {
      create: function(){}
    },
    create: function(data) {
        return {
            then: function(success, fail) {
                if (shouldFail) {
                    fail('error');
                } else {
                    success({_id: data.id});
                }
            }
        };
    },
    search: function(search) {
        return {
            then: function(success, fail) {
                if (shouldFail) {
                    fail('error');
                } else if (shouldReturnSome) {
                    success({
                        took: 12,
                        timed_out: false,
                        _shards: {
                            total: 5,
                            successful: 5,
                            failed: 0
                        },
                        hits: {
                            total: 1,
                            max_score: 1,
                            hits: [
                                {
                                    _index: "market",
                                    _type: "Market",
                                    _id: "1",
                                    _score: 1,
                                    _source: {
                                        id: "1",
                                        name: "Carrefour",
                                        address: "Av. La Plata 15555",
                                        normalizedAddress: 'av. La Plata 15555',
                                        locale: "Quilmes Oeste",
                                        geo: {
                                            lat: -34.1667,
                                            lon: -58.1144
                                        }
                                    }
                                }
                            ]
                        }
                    });
                } else {
                    success({
                        took: 12,
                        timed_out: false,
                        _shards: {
                            total: 5,
                            successful: 5,
                            failed: 0
                        },
                        hits: {
                            total: 0,
                            max_score: null,
                            hits: []
                        }
                    });
                }
            }
        };
    }
};

var db = db = new (require('../services/datastorage'))(esMock);
describe('Data Storage', function() {
    describe('When try to save a market', function() {
        describe('and it fail', function() {
           beforeEach(function() {
               shouldFail = true;
           });
           it('should fail to', function() {
               return db.saveMarket({address: ''}).then(
                   function() {
                       assert.ok(false);
                   },
                   function(error) {
                       assert.equal(error, 'error');
                   }
               );
           })
        });
        describe('and success', function() {
            beforeEach(function() {
                shouldFail = false;
            });
            it('should save and return the market with id', function() {
                return db.saveMarket({address:''}).then(
                    function(market) {
                        market.should.have.property('id');
                    },
                    function() {
                        assert.ok(false);
                    }
                );
            });
        });
    });
    describe('Searching markets', function() {
        beforeEach(function() {
           shouldFail = true;
        });
        describe('When fail db', function() {
            it('should reject the promise by name', function() {
                return db.searchMarketByName('').then(
                    function () {
                        assert.ok(false);
                    },
                    function (error) {
                        assert.equal(error, 'error');
                    }
                );
            });
            it('should reject the promise by address', function() {
                return db.searchMarketByAddress('', '').then(
                    function () {
                        assert.ok(false);
                    },
                    function (error) {
                        assert.equal(error, 'error');
                    }
                );
            });
            it('should reject the promise by geo', function() {
                return db.searchMarketByGeo(0, 0).then(
                    function() {assert.ok(false);},
                    function(error) { assert.equal(error, 'error');}
                );
            });
        });
        describe('When success', function() {
            beforeEach(function(){shouldFail = false;});
            describe('And it return some result', function() {
                beforeEach(function(){shouldReturnSome = true;});
                it('shoult success and return an array', function() {
                    return db.searchMarketByName('name').then(
                        function(markets) {
                            assert.equal(markets[0].id, '1');
                            assert.equal(markets[0].name, 'Carrefour');
                            assert.equal(markets[0].address, 'Av. La Plata 15555');
                            assert.equal(markets[0].normalizedAddress, 'av. la plata 15555');
                            assert.equal(markets[0].geo.lat, -34.1667);
                            assert.equal(markets[0].geo.lon, -58.1144);
                        }, function(error) { assert.ok(false);}
                    );
                });
            });
            describe('And it not return result', function() {
                beforeEach(function() {
                    shouldReturnSome = false;
                });
                it('should success and return an empty list', function() {
                    return db.searchMarketByName('name').then(
                        function(markets) {
                            assert.equal(markets.length, [].length);
                        }, function(error) { assert.ok(false);}
                    );
                });
            })
        });
    });
});

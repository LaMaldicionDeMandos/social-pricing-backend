var assert = require('assert');
var sinon = require('sinon');
var should = require('should');

var shouldFail;
var shouldReturnSome;

var esMock = {
    create: function(data) {
        return {
            then: function(success, fail) {
                if (shouldFail) {
                    fail('error');
                } else {
                    success({_id: '1'});
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
                                        name: "Crrefour",
                                        address: "Av. La plata 15555",
                                        locale: "Quilmes Oeste",
                                        lat: -34.1667,
                                        lon: -58.1144
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
               db.saveMarket({}).then(
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
                db.saveMarket({}).then(
                    function(market) {
                        market.should.have.property('id', '1');
                    },
                    function() {
                        assert.ok(false);
                    }
                );
            });
        });
    });
    describe('Searching markets', function() {
        describe('When fail db', function() {
            it('should reject the promise in all queries', function() {

            });
        });
        describe('When success', function() {
            describe('And it return some result', function() {
                it('shoult success and return an array', function() {

                });
            });
            describe('And it not return result', function() {
                it('should success and return an empty list', function() {

                });
            })
        });
    });
});

var assert = require('assert');
var sinon = require('sinon');
var should = require('should');
var shouldFail;

var db;

var mockery = require('mockery');

describe('Data Storage', function() {
    before(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        var esMock = {
            Client: function() {
                this.create = function(data) {
                    return {
                        then: function(success, fail) {
                            if (shouldFail) {
                                fail('error');
                            } else {
                                success({_id: '1'});
                            }
                        }
                    };
                };
            }
        };
        mockery.registerMock('elasticsearch', esMock);
        db = new (require('../services/datastorage'))('host');
    });

    after(function(){
        mockery.disable();
    });

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
});

/**
 * Created by boot on 3/18/16.
 */
var Market = require('../model/model').Market;
var q = require('q');
var uuid = require('uuid');


function DB(esClient) {
    var marketSchema = {
        index: 'market',
        body: {
            mappings: {
                Market: {
                    properties: {
                        id: {
                            type: 'string',
                            index: "not_analyzed"
                        },
                        name: {
                            type: 'string',
                            index: "not_analyzed"
                        },
                        address: {
                            type: 'string',
                            index: "not_analyzed"
                        },
                        normalizedAddress: {
                            type: 'string',
                            index: "not_analyzed"
                        },
                        locale: {
                            type: 'string',
                            index: "not_analyzed"
                        },
                        geo: {
                            type: 'geo_point',
                            index: "not_analyzed"
                        }
                    }
                }
            }
        }
    };
    esClient.indices.create(marketSchema);
    var mapResults = function(results) {
        return results.hits.hits.map(function(hit) {
            var dto = hit._source;
            return new Market(dto);
        });
    }
    this.saveMarket = function(dto) {
        var def = q.defer();
        dto.id = uuid.v4();
        var market = new Market(dto);
        esClient.create({index: 'market', type: 'Market', id: market.id, body: market}).then(
            function(result) {
                market.id = result._id;
                def.resolve(market);
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };
    this.searchMarketByName = function(name) {
        var def = q.defer();
        var query = {
            index: 'market',
            body: {
                query: {
                    match: {
                        name: {
                            query: name,
                            fuzziness: "AUTO",
                            operator: 'and'
                        }
                    }
                }
            }
        };
        esClient.search(query).then(
            function(result) {
                def.resolve(mapResults(result));
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };
    this.searchMarketByAddress = function(address, locale) {
        var def = q.defer();
        var normalized = Market.normalizeAddress(address);
        var query = {
            index: 'market',
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    normalizedAddress: {
                                        query: normalized,
                                        fuzziness: "AUTO",
                                        operator: 'and'
                                    }
                                }
                            },
                            {
                                match: {
                                    locale: {
                                        query: locale,
                                        fuzziness: "AUTO",
                                        operator: 'and'
                                    }
                                }
                            }
                        ]
                    }

                }
            }
        };
        esClient.search(query).then(
            function(result) {
                def.resolve(mapResults(result));
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };
    this.searchMarketByGeo = function(lat, lon) {
        var def = q.defer();
        var query = {
            index: 'market',
            body: {
                query: {
                    bool: {
                        must: {
                            match_all: {}
                        },
                        filter: {
                            geo_distance: {
                                distance: '100m',
                                geo: {
                                    lat: lat,
                                    lon: lon
                                }
                            }
                        }
                    }
                }
            }
        };
        esClient.search(query).then(
            function(result) {
                def.resolve(mapResults(result));
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };

}

module.exports = DB;
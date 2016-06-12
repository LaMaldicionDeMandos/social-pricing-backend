/**
 * Created by boot on 3/18/16.
 */
var Model =  require('../model/model');
var Market = Model.Market;
var ProductInstance = Model.ProductInstance;
var Product = Model.Product;
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
    var productSchema = {
        index: 'product',
        body: {
            mappings: {
                Product: {
                    properties: {
                        code: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        tradeMark: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        subtype: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        measure: {
                            type: 'float',
                            index: 'not_analyzed'
                        },
                        measureType: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        description: {
                            type: 'string',
                            index: 'not_analyzed'
                        }
                    }
                }
            }
        }
    };
    var productInstanceSchema = {
        index: 'productinstance',
        body: {
            mappings: {
                ProductInstance: {
                    properties: {
                        id: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        code: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        price: {
                            type: 'float',
                            index: 'not_analyzed'
                        },
                        market: {
                            type: 'string',
                            index: 'not_analyzed'
                        }
                    }
                }
            }
        }
    };
    esClient.indices.create(marketSchema);
    esClient.indices.create(productSchema);
    esClient.indices.create(productInstanceSchema);
    var mapResults = function(results, clazz) {
        return results.hits.hits.map(function(hit) {
            var dto = hit._source;
            return new clazz(dto);
        });
    };
    this.saveProductInstance = function(dto) {
        var def = q.defer();
        dto.id = uuid.v4();
        var instance = new ProductInstance(dto);
        esClient.create({index: 'productinstance', type: 'ProductInstance', id: instance.id, body: instance}).then(
            function(result) {
                instance.id = result._id;
                def.resolve(instance);
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };
    this.saveProduct = function(dto) {
        var def = q.defer();
        var product = new Product(dto);
        esClient.create({index: 'product', type: 'Product', id: product.code, body: product}).then(
            function(result) {
                def.resolve(product);
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };
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
    this.searchProductInstancesByCode = function(code) {
        var def = q.defer();
        var query = {
            index: 'productinstance',
            body: {
                query: {
                    match: {
                        code: {
                            query: code
                        }
                    }
                }
            }
        };
        esClient.search(query).then(
            function(result) {
                def.resolve(mapResults(result, ProductInstance));
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };
    this.searchProductByCode = function(code) {
        var def = q.defer();
        var query = {
            index: 'product',
            body: {
                query: {
                    match: {
                        code: {
                            query: code
                        }
                    }
                }
            }
        };
        esClient.search(query).then(
            function(result) {
                def.resolve(mapResults(result, Product));
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
                def.resolve(mapResults(result, Market));
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
                def.resolve(mapResults(result, Market));
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
                def.resolve(mapResults(result, Market));
            },
            function(error) {
                def.reject(error);
            });
        return def.promise;
    };

}

module.exports = DB;
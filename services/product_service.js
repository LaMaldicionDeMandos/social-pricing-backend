/**
 * Created by boot on 6/12/16.
 */
var q = require('q');
function Service(db) {
    this.searchInstances = function(code) {
        return db.searchProductInstancesByCode(code);
    };
    this.searchOne = function(code) {
        var def = q.defer();
        db.searchProductByCode(code).then(
            function(products) {
                if(products.length > 0) {
                    def.resolve(products[0]);
                } else {
                    def.resolve(null);
                }
            },
            function(error) {
                def.reject(error);
            }
        );
        return def.promise;
    };
}

module.exports = Service;

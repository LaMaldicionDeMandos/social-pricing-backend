/**
 * Created by boot on 3/19/16.
 */
function Service(db) {
    this.searchByName = function(name) {
        return db.searchMarketByName(name);
    };
    this.searchByAddress = function(address, locale) {
        return db.searchMarketByAddress(address, locale);
    };
    this.searchByGeo = function(lat, lon) {
        return db.searchMarketByGeo(lat, lon);
    };
}

module.exports = Service;
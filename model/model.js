/**
 * Created by boot on 3/19/16.
 */
var er = /av(enida)?\.? /gi;
function Market(dto) {
    this.id = dto.id;
    this.name = dto.name;
    this.address = dto.address;
    this.normalizedAddress = Market.normalizeAddress(dto.address);
    this.locale = dto.locale;
    this.geo = dto.geo;
}

Market.normalizeAddress = function(address) {
    return address.replace(er, 'av. ').toLowerCase();
}

exports.Market = Market;
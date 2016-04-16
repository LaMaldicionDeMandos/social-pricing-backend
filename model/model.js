/**
 * Created by boot on 3/19/16.
 */
var er = /av(enida)?\.? /gi;
var numEr = /[0-9]+/;
var gNumErr = /([0-9]+)([0-9][0-9])/
function Market(dto) {
    this.id = dto.id;
    this.name = dto.name;
    this.address = dto.address;
    this.normalizedAddress = Market.normalizeAddress(dto.address);
    this.locale = dto.locale;
    this.geo = dto.geo;
}

Market.normalizeAddress = function(address) {
    var normalized = address.replace(er, 'av. ').toLowerCase().trim();
    var tokens = normalized.split(' ');
    var last = tokens[tokens.length-1].trim();
    if (numEr.test(last)) {
        if (last.length > 2) {
            last = last.replace(gNumErr, "$100");
        } else {
            last = '00';
        }
    }
    return tokens.slice(0, tokens.length-1).join(' ') + ' ' + last;
}

exports.Market = Market;
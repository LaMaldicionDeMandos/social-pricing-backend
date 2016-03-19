/**
 * Created by boot on 3/19/16.
 */
function Market(dto) {
    var er = /av(enida)?\.? /gi;
    this.id = dto.id;
    this.name = dto.name;
    this.address = dto.address;
    this.nomalizedAddress = dto.address.replace(er, 'av. ');
    this.locale = dto.locale;
    this.geo = dto.geo;
}

exports.Market = Market;
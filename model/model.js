/**
 * Created by boot on 3/19/16.
 */
function Market(dto) {
    this.id = dto.id;
    this.name = dto.name;
    this.address = dto.address;
    this.nomalizedAddress = dto.normalizedAddress;
    this.locale = dto.locale;
    this.lat = dto.lat;
    this.lon = dto.lon;
}
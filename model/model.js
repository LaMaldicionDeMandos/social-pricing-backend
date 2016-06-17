/**
 * Created by boot on 3/19/16.
 */
var er = /av(enida)?\.? /gi;
var numEr = /[0-9]+/;
var gNumErr = /([0-9]+)([0-9][0-9])/;
var MILISECONDS = 1000;
var SECONDS = MILISECONDS*60;
var MINUTES = SECONDS*60;
var HOURS = MINUTES*24;
function ProductInstance(dto) {
    this.id = dto.id;
    this.code = dto.code;
    this.marketId = dto.marketId;
    this.price = dto.price;
    this.lastUpdate = dto.lastUpdate;
    var that = this;
    var updateValues = function(value, unit) {
        that.updateValue = value;
        that.updateUnit = unit;
    };
    this.makeUpdate = function(_now) {
        var diff = _now.getTime() - this.lastUpdate.getTime();
        var seconds = Math.floor(diff/MILISECONDS);
        if (seconds < 60) updateValues(seconds, 's');
        var minutes = Math.floor(diff/SECONDS);
        if (minutes < 60 && minutes > 0) updateValues(minutes, 'm');
        var hours = Math.floor(diff/MINUTES);
        if (hours < 24 && hours > 0) updateValues(hours, 'h');
        var days = Math.floor(diff/HOURS);
        if (days > 0) updateValues(days, 'd');

    }
}

exports.ProductInstance = ProductInstance;

function Product(dto) {
    this.code = dto.code;
    this.tradeMark = dto.tradeMark;
    this.subtype = dto.subtype;
    this.measure = dto.measure;
    this.measureType = dto.measureType;
    this.description = dto.description;
}

exports.Product = Product;

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
/**
 * Created by boot on 2/28/16.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var MarketSchema = new Schema({_id: ObjectId, name: String, city: String, address:String, number: Number, lat:Number,
    lon:Number, alt:Number});

var Market = mongoose.model('MArket', MarketSchema);

var db = function(credentials) {
    mongoose.connect(credentials);
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    console.log('Connecting to mongodb');
    this.mongoose = mongoose;
    this.Schema = Schema;
    this.ObjectId = mongoose.Types.ObjectId;
    this.Market = Market;
};

process.on('exit', function() {
    console.log('Desconnecting db');
    mongoose.disconnect();
});

module.exports = db;
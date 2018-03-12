let mongoose = require('mongoose');
var Schema = mongoose.Schema;


let produtSchema = new Schema({
    "productId":{type:String},
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "productNum":Number,
    "checked":String

});
module.exports = mongoose.model('Good',produtSchema);

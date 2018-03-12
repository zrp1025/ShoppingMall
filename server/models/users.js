let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let usersSchema = new Schema({
	"userId":String,
	"userPwd":String,
	"userName":String,
	"orderList":Array,
	"cartList":[
		{
			"productName":String,
			"productId":String,
			"salePrice":String,
			"productNum":String,
			"checked":Number,
			"productImage":String
		}
	],
	"addressList":[
		{
			"addressId":String,
			"userName":String,
			"streetName":String,
			"postCode":Number,
			"tel":Number,
			"isDefault":Boolean,
		}
	]
});
module.exports = mongoose.model('User',usersSchema);
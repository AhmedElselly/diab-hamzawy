const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema = new Schema({
	orderedBy: {
		type: String,
		required: true
	},
	cart: {
		type: Object,
		required: true
	},
	items: [],
	
	address: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});


module.exports = mongoose.model('Order', orderSchema);
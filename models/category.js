const mongoose = require('mongoose');
const {Schema} = mongoose;


const categorySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	parentId: String
});

module.exports = mongoose.model('Category', categorySchema);

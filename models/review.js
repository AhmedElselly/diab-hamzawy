const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Review', reviewSchema);
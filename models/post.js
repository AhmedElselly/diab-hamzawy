const mongoose = require('mongoose');
const {Schema} = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const postSchema = new Schema({
	name: {
		type: String,
		required: true
	},

	images: [
		{
			url: String,
			public_id: String
		}
	],

	body: {
		type: String,
		required: true
	},

	price: {
		type: Number,
		required: true
	},

	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	],

	avgRating: Number,
	category: {
		type: String,
		// ref: 'Category',
		required: true
	}
});


postSchema.methods = {
	calculateAverageRating(){
		let total = 0;
		for(var i = 0; i < this.reviews.length; i++){
			total+=this.reviews[i].rating;
		}
		// console.log(total);
		if(!this.reviews){
			this.avgRating = 0
		} else {
			this.avgRating = Math.floor(Math.round((total/this.reviews.length) * 10) / 10);
			// this.avgRating = 0
		}
		console.log(this.avgRating)
		this.save()
		return this.avgRating;
	}
}

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', postSchema);
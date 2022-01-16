const Review = require('../models/review');

module.exports = {
	async create(req, res){
		console.log(req.body)
		// console.log(req.body.review['rating'])
		const post = await req.post;
		// post.review = [];
		const review = await new Review(req.body);
		console.log(review);
		review.author = req.user;
		review.save();
		post.reviews.push(review);
		post.save();
		res.redirect(`/posts/show/${req.post._id}`);
	}
}
const path = require('path');
const Post = require('../models/post');
const Category = require('../models/category');
const Cart = require('../models/cart');
const cloudinary = require('cloudinary');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

cloudinary.config({
    cloud_name: "elselly",
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRETKEY
});

const formatBufferTo64 = file => parser.format(path.extname(file.originalname).toString(), file.buffer)

module.exports = {
	getPostById(req, res, next, id){
		Post.findById(id)
		.populate('author')
		.populate({path: 'reviews', populate: {path: 'author'}})
		.exec((err, post) => {
			if(err) throw new Error('No post with such ID found!');
			req.post = post;
			next();
		})
	},

	async postForm(req, res){
		const categories = await Category.find();

		res.render('posts/new', {categories});
	},

	async create(req, res){

		const post = await new Post(req.body);
		post.author = req.user;
		post.category = await req.body.category;
		if(req.files){
			const images = await req.files.map(async file => {
				// console.log(file.buffer)
				const file64 = formatBufferTo64(file)
				const image = await cloudinary.v2.uploader.upload(file64.content)
				console.log(image)
				await post.images.push({
					url: await image.secure_url,
					public_id: await image.public_id
				});
			});
		}	

		setTimeout(() => {
			post.save((err, post) => {
				if(err) throw new Error(err);
				res.redirect('/posts');
			})	
		},5000)
		
	},

	async remove(req, res){
		const post = await req.post;
		post.remove();
		res.redirect('/');
	},

	async postIndex(req, res){
		const {dbQuery} = res.locals;
		const posts = await Post.paginate(dbQuery, {
			page: req.query.page || 1,
			limit: 9,
			sort: {_id: -1}
		});
		res.render('posts/index', {posts});
	},

	async postShow(req, res){
		const post = await req.post;
		console.log(post)
		const reviews = post.reviews;
		const averageRating = post.calculateAverageRating();
		const relatedPosts = await Post.find({_id: {$ne: req.post}, category: req.post.category}).limit(2);
		console.log(relatedPosts)
		const title = post.name;
		res.render('posts/show', {
			post,
			title,
			reviews,
			relatedPosts,
			averageRating
		});
	},

	async postEdit(req, res){
		const post = await req.post;
		const categories = await Category.find();
		res.render('posts/edit', {post, categories});
	},

	//post update
    async update(req, res, next){
       // find the post by id
        // const {post} = res.locals;
        const post = await req.post;
       // check if there's any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {			
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages) {
				// delete images from cloudinary
				await cloudinary.v2.uploader.destroy(public_id);
				// delete image from post.images
				for(const image of post.images) {
					if(image.public_id === public_id) {
						let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		// check if there are any new images for upload
		if(req.files) {
			// upload images
			// for(let file of req.files) {
			// add images to post.images array
			req.files.map(async file => {
				const file64 = formatBufferTo64(file)
				const image = await cloudinary.v2.uploader.upload(file64.content)
				console.log(image)
				await post.images.push({
					url: await image.secure_url,
					public_id: await image.public_id
				});
			})
    	}
        
		// update the post with any new properties
		post.name = req.body.post.name;
		post.body = req.body.post.body;
	    post.price = req.body.post.price;
		post.category = await req.body.post.category;
        // post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		// save the updated post into the db
		setTimeout(() => {
			post.save((err, post) => {
				if(err) throw new Error(err);
				res.redirect(`/posts/show/${req.post._id}`);
			})	
		},5000)
    },

  async getByCategory(req, res){
  	const posts = await Post.distinct('category', {});
  	res.json(posts);
  },

  async getPostsByCategory(req, res){
  	// const posts = await Post.find({category: req.params.text})
  	// 	.populate('author');
  	const posts = await Post.paginate({category: req.params.text}, {
  		page: req.query.page || 1,
  		limit: 10,
  		sort: {'_id': -1}
  	});

  	res.render('posts/byCategory', {posts, title: req.params.text});
  },

	async addToCart(req, res){
		let cart = await new Cart(req.session.cart ? req.session.cart : {items: {}});
		// req.post.images = undefined;
		cart.addItem(req.post._id, req.post);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect(`/posts/cart`)
	},

	async cart(req, res){
		if(!req.session.cart){
			return res.render('posts/cart', {posts: []})
		}
		const cart = new Cart(req.session.cart);
		// console.log(cart.generateArray())
		res.render('posts/cart', {
			posts: cart.generateArray(),
			total: cart.totalPrice,
		 	qty: cart.totalQty
		});
	},

	async add(req, res){
		const post = req.post;
		const cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
		cart.add(post._id);
		req.session.cart = cart;
		res.redirect('/posts/cart');
	},

	async reduce(req, res){
		const post = req.post;
		const cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
		cart.reduce(post._id);
		req.session.cart = cart;
		res.redirect('/posts/cart');		
	}
}
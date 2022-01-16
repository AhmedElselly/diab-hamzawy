const User = require('../models/user');
const Cart = require('../models/cart');
const Order = require('../models/order');

module.exports = {
	getRegisterPage(req, res){
		res.render('register', {title: 'Register'});
	},

	async register(req, res){
		const foundUser = await User.findOne({email: req.body.email});
		if(foundUser){
			throw new Error('User already exists')
			
		}
		const user = await new User(req.body);
		await user.setPassword(req.body.password);
		await user.save();
		req.login(user, (err) => {
			if(err) console.log(err);
			res.redirect('/');	
		})
		
	},

	loginPage(req, res){
		res.render('login');
	},

	async login(req, res){
		const {user} = await User.authenticate()(req.body.email, req.body.password);
		
		req.login(user, (err) => {
			if(err) throw new Error('Email and password do not match!')
			res.redirect('/');		
		})
		
	},

	logout(req, res){
		req.logout();
		res.redirect('/users/login');
	},

	async profile(req, res){
		const user = await User.findById(req.user._id);
		const orders = await Order.find().populate('orderedBy');
		console.log(orders)
		let cart;
		orders.forEach(order => {
			cart = new Cart(order.cart)
			order.items = cart.generateArray();
		})

		res.render('profile', {orders, user});
	},

	async update(req, res){
		const user = await User.findById(req.params.userId);
		user.email = req.body.email;
		user.username = req.body.username;
		user.admin = req.body.admin;

		await user.save();
		res.redirect('/');
	}
}
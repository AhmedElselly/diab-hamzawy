const Order = require('../models/order');

module.exports = {
	async create(req, res){
		const order = await new Order(req.body);
		order.cart = req.session.cart;
		order.orderedBy = req.user.username || req.body.name;
		order.save();
		res.redirect('/'); 
	},

	async ordersIndex(req, res){
		const orders = await Order.find();
		console.log(orders)
		res.render('orders/index', {orders});
	}
}
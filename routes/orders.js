const express = require('express');
const router = express.Router();

const {
	isAuth,
	isAdmin
} = require('../middlewares');

const {
	create,
	ordersIndex
} = require('../controllers/orders');

router.post('/', create);
router.get('/', isAuth, isAdmin, ordersIndex);

// router.param('userId', getUserById);

module.exports = router;
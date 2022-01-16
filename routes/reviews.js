const express = require('express');
const router = express.Router();

const {
	isAuth
} = require('../middlewares');

const {
	getPostById
} = require('../controllers/posts');

const {
	create,
	reviewIndex
} = require('../controllers/reviews');


router.post('/new/:postId', isAuth, create);

router.param('postId', getPostById);

module.exports = router;
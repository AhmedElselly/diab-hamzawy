const express = require('express');
const router = express.Router();
const Post = require('../models/post');

const {
	search
} = require('../middlewares');


/* GET home page. */
router.get('/', search, async function(req, res, next) {
	const {dbQuery} = res.locals;

	const posts = await Post.paginate(dbQuery, {
		limit: 3,
		sort: {'_id': -1},
		populate: 'author'
	})
	

  res.render('index', {posts: posts.docs});
});

module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];
const upload = multer({storage: multer.memoryStorage()});

const {
	search,
	isAdmin,
	isAuth
} = require('../middlewares');

const {
	postForm,
	postIndex,
	create,
	postShow,
	postEdit,
	getPostById,
	update,
	remove,
	addToCart,
	cart,
	getByCategory,
	getPostsByCategory,
	add,
	reduce
} = require('../controllers/posts');

router.get('/', search, postIndex);
router.get('/categories', search, getByCategory);
router.get('/categories/:text', search, getPostsByCategory);
router.get('/add-to-cart/:postId', search, addToCart);
router.get('/cart', search, cart);
router.get('/add/:postId', search, add);
router.get('/reduce/:postId', search, reduce);
router.get('/new', search, isAuth, isAdmin, postForm);
router.post('/new', search, isAuth, isAdmin, upload.array('images', 4), create);
router.delete('/remove/:postId', search, isAuth, isAdmin, remove);
router.get('/show/:postId', search, postShow);

router.get('/:postId/edit', search, isAuth, isAdmin, postEdit);
router.put('/:postId/edit', isAuth, isAdmin, upload.array('images', 4), update);

router.param('postId', getPostById);

module.exports = router;
const express = require('express');
const router = express.Router();

const {
	search,
	isAuth,
	isAdmin
} = require('../middlewares');

const {
	create,
	categoryIndex,
	manage,
	categoryEdit,
	categoryForm
} = require('../controllers/categories');

router.get('/', categoryIndex);
router.get('/new', search, isAuth, isAdmin, categoryForm);
router.get('/manage', search, isAuth, isAdmin, manage);
router.get('/edit/:id', search, isAuth, isAdmin, categoryEdit);
router.post('/new', isAuth, isAdmin, create);

module.exports = router;
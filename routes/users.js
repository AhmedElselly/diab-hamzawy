var express = require('express');
var router = express.Router();

const {
	search,
	isAuth
} = require('../middlewares');

const {
	register,
	loginPage,
	login,
	getRegisterPage,
	logout,
	profile,
	update
} = require('../controllers/users');

/* GET users listing. */
router.get('/register', search, getRegisterPage);
router.get('/login', search, loginPage);
router.get('/logout', search, logout);
router.post('/register', search, register);
router.post('/login', search, login);
router.put('/update/:userId', isAuth, update);

router.get('/profile/:userId', search, profile)

module.exports = router;

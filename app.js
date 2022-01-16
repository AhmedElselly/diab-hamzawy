require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo').default;
const helmet = require('helmet');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/home_run', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB');
});

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const categoriesRouter = require('./routes/categories');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
	secret: 'hello,world',
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/home_run'}),
	cookie: {
		maxAge: 180*60*1000
	}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.title = 'Home Run';
	res.locals.session = req.session;
	next();
});

app.use('/', indexRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/reviews', reviewsRouter);
app.use('/categories', categoriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
	console.log(`Server is on port ${PORT}`);
});
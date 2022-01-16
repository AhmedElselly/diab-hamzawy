const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
	username: String,
	email: String,
	admin: {
		type: Boolean,
		default: false
	}
});

userSchema.plugin(passportLocalMongoose, {
	usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);
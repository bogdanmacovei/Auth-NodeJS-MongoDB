var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: String,
	password: String,
	hasAccount: Boolean,
	isConfirmed: Boolean,
	email: String,
	sesstoken: {
		type: String,
		default: ""
	}

}, {collection: 'UserTerraDemo'});

mongoose.model ('UserTerraDemo', userSchema);
// Dependencies
// NPM Modules

var express = require ('express');
var app = express();
var mongoose = require ('mongoose');
var bodyParser = require ('body-parser');
var cookieParser = require ('cookie-parser');
var uuid = require ('node-uuid');
var https = require ('https');

// App configuration

app.use (cookieParser());
app.use (bodyParser.json());
app.use (bodyParser.urlencoded({ extended: true }));

// Database connection

mongoose.Promise = global.Promise;
mongoose.connect ('mongodb://localhost:27017/mydb')
	.then(() => console.log('Connected'))
	.catch(err => console.log(err));

// Server start 

var server = app.listen(process.env.PORT || 8000, function() {
  console.log ("App is listening on http://localhost:%d", server.address().port);
});

require ("./models/usermodel");
var User = mongoose.model ('UserTerraDemo');

// Modules

var Auth = require ('./modules/auth');
var auth = new Auth(User);

var account = require ('./modules/account');
account (app, auth, mongoose);

var routes = require ('./modules/routes');
routes (app, auth, __dirname);

var restUser = require("./modules/restuser");
restUser(app, auth, mongoose);

// App status configuration

app.use (function (req, res, next) {
	if (res.status (404)) {
    	res.send("404");
  	}
});

// Show users in console

User.find ({})
	.catch (err => {
		console.log (err);
	})
	.then (res => {
		console.log (res);
	});
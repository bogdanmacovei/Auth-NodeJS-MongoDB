var bcrypt = require('bcryptjs');
var basic = require("./basic_functions");
var uuid = require('node-uuid');

module.exports = function (app, auth, mongoose) {
	var User = mongoose.model ('UserTerraDemo');

	app.post ('/creating', auth.isNotAuth, function (req, res) {
		var userdata = req.body;
		if (userdata.firstname && userdata.lastname && userdata.username && userdata.password && userdata.email && userdata.passwordVerif) {
			if (userdata.password == userdata.passwordVerif) {
				passwordVerifyString = basic.passwordRegex (userdata.password);
				usernameVerifyString = basic.usernameRegex (userdata.username);

				if (passwordVerifyString != 'ok') {
					res.send (passwordVerifyString);
				}
				else if (usernameVerifyString != 'ok') {
					res.send (usernameVerifyString);
				}
				else {
					userdata.password = userdata.password.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
					var salt = bcrypt.genSaltSync(10);
					var hashedPassword = bcrypt.hashSync (userdata.password, salt);

					User.find({$or: [{username: userdata.username.toLowerCase()}, {email: userdata.email}]}, function (err, data) {
						if (err) {
							res.send ('Email sau username deja folosit');
						}
						else if (data.length != 0) {
							User.findOne({$and: [{cui: escapedCui.toLowerCase()}, {hasAccount: false}]}, function (err, result) {
								if (!err && result) {
									result.firstname = userdata.firstname;
									result.lastname = userdata.lastname;
									result.username = userdata.username;
									result.password = hashedPassword;
									result.email = userdata.email;
									result.hasAccount = true;
									result.isConfirmed = true;

									var today = new Date();
									var exp = new Date(today);
									exp.setDate(today.getDate() + 60);

									var token = auth.generateToken({
										ip: req.connection.remoteAddress,
										username: userdata.email,
										exp: parseInt (exp.getTime() / 1000)
									});

									res.cookie ('sesid', token);

									result.sesstoken = token;
									result.save();
									res.send ('Account created!');
								}
							});
						}

						else {
							// Generate token

							var today = new Date();
							var exp = new Date(today);
							exp.setDate (today.getDate() + 60);
							
							var token = auth.generateToken ({
								ip: req.connection.remoteAddress,
								username: userdata.email,
								exp: parseInt (exp.getTime() / 1000)
							});

							res.cookie ('sesid', token);

							// End generate token

							var userInsertObject = new User ({
								firstname: userdata.firstname, 
								lastname: userdata.lastname,
								username: userdata.username,
								password: hashedPassword,
								hasAccount: true,
								isConfirmed: true,
								email: userdata.email,
								sesstoken: token
							});

							userInsertObject.save();
							res.send ('Account created!');
						}
					});
				}
			}
			else {
				res.send ('Parolele nu coincid!');
			}
		}
		else {
			res.send ('Ati lasat campuri vide!');
		}
	});

	app.post ('/loggingIn', auth.isNotAuth, function (req, res) {
		var userdata = req.body;

		if (userdata.password && userdata.email) {
			User.findOne ({email: userdata.email.toLowerCase()}, function (err, data) {
				if (err) {
					console.log (err);
				}
				if (data == undefined) {
					res.send ('Contul nu exista');
				}
				else {
					bcrypt.compare (userdata.password, data.password, function (err, pwdcheck) {
						if (err) {
							console.log (err);
						}
						if (pwdcheck) {
							// Generate Token
							var today = new Date();
							var exp = new Date(today);
							exp.setDate (today.getDate() + 60);
							var token = auth.generateToken ({
								ip: req.connection.remoteAddress,
								username: userdata.email,
								exp: parseInt (exp.getTime() / 1000)
							});

							res.cookie ('sesid', token);
							data.sesstoken = token;
							data.save();
							// End generate token
							res.send ('Logged in');
						}
						else {
							res.send ('Username and password do not match');
						}
					});
				}
			});
		}
		else {
			res.send ('Ati lasat campuri vide!');
		}
	});
};
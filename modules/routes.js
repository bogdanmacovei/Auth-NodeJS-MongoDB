module.exports = function (app, auth, dirname) {
	app.get ('/', auth.isAuth, function (req, res) {
		res.sendFile (dirname + '/views/index.html');
	});

	app.get ('/register', auth.isNotAuth, function (req, res) {
		res.sendFile (dirname + '/views/register.html');
	});

	app.get ('/login', auth.isNotAuth, function (req, res) {
		res.sendFile (dirname + '/views/login.html');
	});
}
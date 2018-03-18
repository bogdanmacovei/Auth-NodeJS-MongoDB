module.exports = function(app, auth, mongoose) {
	var User = mongoose.model ('UserTerraDemo');
	app.get ('/selectUserEmail/:email', function (req, res) {
		User.find({email: req.params.email})
		.select('-password')
		.select('-sesstoken')
		.select('-_id')
		.select('-hasAccount')
		.select('-isConfirmed')
		.select('-email')
			.catch (err => {
				console.log (err)
			})
			.then (result => {
				res.send (result);
			});
	});
};
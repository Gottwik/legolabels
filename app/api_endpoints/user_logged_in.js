// * ———————————————————————————————————————————————————————— * //
// * 	/user_logged_in endpoint
// * ———————————————————————————————————————————————————————— * //
var user_logged_in_endpoint = function () {}

// local dependencies

user_logged_in_endpoint.prototype.init = function (app) {
	app.get('/user_logged_in', function (req, res) {
		user_manager.user_logged_in(JSON.parse(req.query.user))
			.then((user) => {
				res.send(user)
			})
	})
}

module.exports = new user_logged_in_endpoint()

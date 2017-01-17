// * ———————————————————————————————————————————————————————— * //
// * 	/usercount endpoint
// * ———————————————————————————————————————————————————————— * //
var usercount_endpoint = function () {}

// local dependencies
var temper = require(ENDURO_FOLDER + '/libs/temper/temper')

usercount_endpoint.prototype.init = function (app) {
	app.get('/usercount', function (req, res) {
		user_manager.get_user_count()
			.then((usercount) => {
				return temper.render('stats/usercount', {usercount: usercount})
			})
			.then((rendered_temp) => {
				res.send(rendered_temp)
			})
	})
}

module.exports = new usercount_endpoint()

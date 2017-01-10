// * ———————————————————————————————————————————————————————— * //
// * 	/get_setups endpoint
// * ———————————————————————————————————————————————————————— * //
var get_setups_endpoint = function () {}

// local dependencies

get_setups_endpoint.prototype.init = function (app) {
	app.get('/get_setups', function (req, res) {
		label_setup_handler.get_label_setups(req.query.user_id)
			.then((get_setups_response) => {
				res.send(get_setups_response)
			})
	})
}

module.exports = new get_setups_endpoint()

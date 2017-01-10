// * ———————————————————————————————————————————————————————— * //
// * 	/get_default_setup endpoint
// * ———————————————————————————————————————————————————————— * //
var get_default_setup_endpoint = function () {}

// local dependencies

get_default_setup_endpoint.prototype.init = function (app) {
	app.get('/get_default_setup', function (req, res) {
		res.send(label_setup_handler.default_label_setup)
	})
}

module.exports = new get_default_setup_endpoint()

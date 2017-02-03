// * ———————————————————————————————————————————————————————— * //
// * 	/get_config endpoint
// * ———————————————————————————————————————————————————————— * //
var get_config_endpoint = function () {}

// local dependencies

get_config_endpoint.prototype.init = function (app) {
	app.get('/get_config', function (req, res) {

		var config = {}

		config.rebrickable_api_key = REBRICKABLE_API_KEY

		res.send(config)
	})
}

module.exports = new get_config_endpoint()

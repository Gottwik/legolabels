// * ———————————————————————————————————————————————————————— * //
// * 	/add_label_setup endpoint
// * ———————————————————————————————————————————————————————— * //
var add_label_setup_endpoint = function () {}

// local dependencies

add_label_setup_endpoint.prototype.init = function (app) {
	app.get('/add_label_setup', function (req, res) {
		label_setup_handler.add_label_setup(JSON.parse(req.query.label_setup), req.query.user_id)
			.then((add_label_setup_response) => {
				res.send(add_label_setup_response)
			})
	})
}

module.exports = new add_label_setup_endpoint()

// * ———————————————————————————————————————————————————————— * //
// * 	/edit_setup endpoint
// * ———————————————————————————————————————————————————————— * //
var edit_setup_endpoint = function () {}

// local dependencies

edit_setup_endpoint.prototype.init = function (app) {
	app.get('/edit_setup', function (req, res) {
		label_setup_handler.edit_setup(JSON.parse(req.query.label_setup))
			.then(() => {
				res.send({success: true})
			})
	})
}

module.exports = new edit_setup_endpoint()

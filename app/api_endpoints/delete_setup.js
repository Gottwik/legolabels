// * ———————————————————————————————————————————————————————— * //
// * 	/delete_setup endpoint
// * ———————————————————————————————————————————————————————— * //
var delete_setup_endpoint = function () {}

// local dependencies

delete_setup_endpoint.prototype.init = function (app) {
	app.get('/delete_setup', function (req, res) {
		label_setup_handler.delete_setup(req.query.setup_id)
			.then(() => {
				res.send({success: true})
			})
	})
}

module.exports = new delete_setup_endpoint()

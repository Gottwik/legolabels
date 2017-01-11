// * ———————————————————————————————————————————————————————— * //
// * 	/update_color endpoint
// * ———————————————————————————————————————————————————————— * //
var update_color_endpoint = function () {}

// local dependencies

update_color_endpoint.prototype.init = function (app) {
	app.get('/update_color', function (req, res) {
		parts_manager.update_color(req.query.part_id, JSON.parse(req.query.new_color))
			.then((update_color_response) => {
				res.send(update_color_response)
			})
	})
}

module.exports = new update_color_endpoint()

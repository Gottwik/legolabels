// * ———————————————————————————————————————————————————————— * //
// * 	/delete_part endpoint
// * ———————————————————————————————————————————————————————— * //
var delete_part_endpoint = function () {}

// local dependencies

delete_part_endpoint.prototype.init = function (app) {
	app.get('/delete_part', function (req, res) {
		parts_manager.delete_part(req.query.part_id)
			.then(() => {
				res.send({success: true})
			})
	})
}

module.exports = new delete_part_endpoint()

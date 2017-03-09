// * ———————————————————————————————————————————————————————— * //
// * 	/delete_parts endpoint
// * ———————————————————————————————————————————————————————— * //
var delete_parts_endpoint = function () {}

// local dependencies

delete_parts_endpoint.prototype.init = function (app) {
	app.get('/delete_parts', function (req, res) {
		parts_manager.delete_parts(req.query.part_ids)
			.then(() => {
				res.send({success: true})
			})
	})
}

module.exports = new delete_parts_endpoint()

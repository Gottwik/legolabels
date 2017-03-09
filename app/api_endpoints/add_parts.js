// * ———————————————————————————————————————————————————————— * //
// * 	/add_parts endpoint
// * ———————————————————————————————————————————————————————— * //
var add_parts_endpoint = function () {}

add_parts_endpoint.prototype.init = function (app) {
	app.get('/add_parts', function (req, res) {
		parts_manager.add_parts(req.query.part_ids, req.query.user_id)
			.then((add_parts_response) => {
				res.send({success: true, inserted_parts: add_parts_response})
			}, () => {
				res.send({success: false})
			})
	})
}

module.exports = new add_parts_endpoint()

// * ———————————————————————————————————————————————————————— * //
// * 	/add_part endpoint
// * ———————————————————————————————————————————————————————— * //
var add_part_endpoint = function () {}

add_part_endpoint.prototype.init = function (app) {
	app.get('/add_part', function (req, res) {
		parts_manager.add_part(req.query.part_id, req.query.user_id)
			.then((add_part_response) => {
				res.send({success: true, inserted_part: add_part_response})
			}, () => {
				res.send({success: false})
			})
	})
}

module.exports = new add_part_endpoint()

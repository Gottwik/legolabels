// * ———————————————————————————————————————————————————————— * //
// * 	/add_part endpoint
// * ———————————————————————————————————————————————————————— * //
var add_part_endpoint = function () {}

add_part_endpoint.prototype.init = function (app) {
	app.get('/add_part', function (req, res) {
		parts_manager.add_part(JSON.parse(req.query.part), JSON.parse(req.query.user))
			.then((add_part_response) => {
				res.send({success: true, inserted_part: add_part_response})
			}, () => {
				res.send({success: false})
			})
	})
}

module.exports = new add_part_endpoint()

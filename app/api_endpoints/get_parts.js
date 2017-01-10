// * ———————————————————————————————————————————————————————— * //
// * 	/get_parts endpoint
// * ———————————————————————————————————————————————————————— * //
var get_parts_endpoint = function () {}

// local dependencies

get_parts_endpoint.prototype.init = function (app) {
	app.get('/get_parts', function (req, res) {

		var user_id = req.query.user_id

		parts_manager.get_parts(user_id)
			.then((get_parts_response) => {
				res.send({success: true, parts: get_parts_response})
			}, (get_parts_response) => {
				res.send({success: false, parts: []})
			})
	})
}

module.exports = new get_parts_endpoint()

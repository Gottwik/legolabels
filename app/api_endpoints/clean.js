// * ———————————————————————————————————————————————————————— * //
// * 	/clean endpoint
// * ———————————————————————————————————————————————————————— * //
var clean_endpoint = function () {}

clean_endpoint.prototype.init = function (app) {
	app.get('/clean', function (req, res) {

		// // sets all labels to not firstlogins
		// label_setup_handler.set_all_not_default()
		// 	.then(() => {
		// 		res.send('ok')
		// 	})

		// // deletes all label setups based on user id
		var user_id = req.query.auth
		label_setup_handler.delete_all_labels_by_user_id(user_id)
			.then(() => {
				res.send('ok', user_id)
			})

	})
}

module.exports = new clean_endpoint()

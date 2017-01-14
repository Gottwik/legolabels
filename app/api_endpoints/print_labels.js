// * ———————————————————————————————————————————————————————— * //
// * 	/print_labels endpoint
// * ———————————————————————————————————————————————————————— * //
var print_labels_endpoint = function () {}

// local dependencies

print_labels_endpoint.prototype.init = function (app) {
	app.post('/print_labels', function (req, res) {
		var parts_json_string = ''

		req.on('data', function (data) {
			parts_json_string += data
		})

		req.on('end', function () {
			var parts_request_data = JSON.parse(parts_json_string)

			labels_printer.print_labels(JSON.parse(parts_request_data.parts), parts_request_data.label_setup, res)
		})
	})
}

module.exports = new print_labels_endpoint()

// * ———————————————————————————————————————————————————————— * //
// * 	/print_labels endpoint
// * ———————————————————————————————————————————————————————— * //
var print_labels_endpoint = function () {}

// local dependencies

print_labels_endpoint.prototype.init = function (app) {
	app.get('/print_labels', function (req, res) {
		labels_printer.print_labels(JSON.parse(req.query.parts), JSON.parse(req.query.label_setup), res)
	})
}

module.exports = new print_labels_endpoint()

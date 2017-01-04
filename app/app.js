var local_app = function () {}

// vendor dependencies
var mongo_client = require('mongodb').MongoClient
// var object_id = require('mongodb').ObjectId

// local dependencies
var parts_manager = require('./lib/parts_manager')
var labels_printer = require('./lib/labels_printer')

// constants
var DATABASE_URL = 'mongodb://gottwik:Souvenir1902.@ds043952.mongolab.com:43952/gottwik'

local_app.prototype.init = function (app) {

	// try to connect to mongodb
	mongo_client.connect(DATABASE_URL, function (err, mongo_db) {
		if (err) { console.log(err) }

		parts_manager.init(mongo_db)
	})

	// endpoints
	app.get('/add_part', function (req, res) {
		parts_manager.add_part(JSON.parse(req.query.part), JSON.parse(req.query.user))
			.then((add_part_response) => {
				res.send({success: true, message: add_part_response})
			}, (add_part_response) => {
				res.send({success: false, message: add_part_response})
			})
	})

	app.get('/get_parts', function (req, res) {

		var user_id = req.query.user_id

		parts_manager.get_parts(user_id)
			.then((get_parts_response) => {
				res.send({success: true, parts: get_parts_response})
			}, (get_parts_response) => {
				res.send({success: false, parts: []})
			})
	})

	app.get('/print_labels', function (req, res) {
		labels_printer.print_labels(JSON.parse(req.query.parts), JSON.parse(req.query.label_setup), res)
	})

}

module.exports = new local_app()

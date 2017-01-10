var local_app = function () {}

// vendor dependencies
var mongo_client = require('mongodb').MongoClient

// local dependencies
var parts_manager = require('./lib/parts_manager')
var labels_printer = require('./lib/labels_printer')
var label_setup_handler = require('./lib/label_setup_handler')

// constants
var DATABASE_URL = (global.config.secret && global.config.secret.DATABASE_URL) || process.env.DATABASE_URL

local_app.prototype.init = function (app) {

	// try to connect to mongodb
	mongo_client.connect(DATABASE_URL, function (err, mongo_db) {
		if (err) { console.log(err) }

		parts_manager.init(mongo_db)
		label_setup_handler.init(mongo_db)
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

	app.get('/get_default_setup', function (req, res) {
		res.send(label_setup_handler.default_label_setup)
	})

	app.get('/add_label_setup', function (req, res) {
		label_setup_handler.add_label_setup(JSON.parse(req.query.label_setup), req.query.user_id)
			.then((add_label_setup_response) => {
				res.send(add_label_setup_response)
			})
	})

	app.get('/get_setups', function (req, res) {
		label_setup_handler.get_label_setups(req.query.user_id)
			.then((get_setups_response) => {
				res.send(get_setups_response)
			})
	})

	app.get('/delete_setup', function (req, res) {
		label_setup_handler.delete_setup(req.query.setup_id)
			.then(() => {
				res.send({success: true})
			})
	})

	app.get('/edit_setup', function (req, res) {
		label_setup_handler.edit_setup(JSON.parse(req.query.label_setup))
			.then(() => {
				res.send({success: true})
			})
	})

}

module.exports = new local_app()

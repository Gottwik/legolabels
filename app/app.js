var local_app = function () {}

// vendor dependencies
var mongo_client = require('mongodb').MongoClient
var glob = require('glob')
var path = require('path')

// local dependencies
global.parts_manager = require('./libs/parts_manager')
global.user_manager = require('./libs/user_manager')
global.labels_printer = require('./libs/labels_printer')
global.label_setup_handler = require('./libs/label_setup_handler')

// constants
var DATABASE_URL = (global.config.secret && global.config.secret.DATABASE_URL) || process.env.DATABASE_URL

local_app.prototype.init = function (app) {

	// try to connect to mongodb
	mongo_client.connect(DATABASE_URL, function (err, mongo_db) {
		if (err) { console.log(err) }

		parts_manager.init(mongo_db)
		label_setup_handler.init(mongo_db)
		user_manager.init(mongo_db)
	})

	// hook up /api_endpoints folder
	glob.sync(path.join(CMD_FOLDER, 'app', 'api_endpoints', '**', '*.js')).forEach(function (file) {
		require(path.resolve(file)).init(app)
	})

}

module.exports = new local_app()

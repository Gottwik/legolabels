var local_app = function () {}

var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var url = 'mongodb://gottwik:Souvenir1902.@ds043952.mongolab.com:43952/gottwik'

local_app.prototype.init = function(app){

	var countdown_collection
	MongoClient.connect(url, function(err, db) {
		countdown_collection = db.collection('countdown_collection')
	})

	app.get('/click', function(req, res) {
		countdown_collection.insert({timestamp: new Date(), user_agent: req.get('User-Agent')}, function(err, result){
			res.send({success: true})
		})
	})

	app.get('/get_clicks', function(req, res) {
		countdown_collection.count({}, function(err, result){
			res.send({success: true, count: result})
		})
	})
}

module.exports = new local_app()

var parts_manager = function () {}

// vendor dependencies
var Promise = require('bluebird')
var _ = require('lodash')

// local dependencies

parts_manager.prototype.init = function (db) {
	this.parts_collection = db.collection('legolabels_parts')
}

parts_manager.prototype.add_part = function (part, user) {
	var self = this

	return new Promise(function (resolve, reject) {
		part_to_be_inserted = {}

		part_to_be_inserted.user_id = user.user_id
		part_to_be_inserted.timestamp = +new Date

		part_to_be_inserted.part = part
		self.parts_collection.insert(part_to_be_inserted, () => {
			resolve()
		})
	})

}

parts_manager.prototype.get_parts = function (user_id) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.parts_collection.find({user_id: user_id}).toArray((err, parts) => {
			if (err) { return reject(err) }

			parts = _.map(parts, (part) => {
				return part.part
			})

			resolve(parts)
		})
	})
}

module.exports = new parts_manager()

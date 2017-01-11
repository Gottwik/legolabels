var parts_manager = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')
var object_id = require('mongodb').ObjectId
var _ = require('lodash')

parts_manager.prototype.init = function (db) {
	var self = this
	self.parts_collection = db.collection('legolabels_parts')

	fs.readFile(path.join(CMD_FOLDER, 'app', 'data', 'categories.json'), 'utf8', function (err, categories) {
		if (err) { console.log(err) }

		self.categories = JSON.parse(categories)
	})
}

parts_manager.prototype.add_part = function (part, user) {
	var self = this

	return new Promise(function (resolve, reject) {
		part_to_be_inserted = {}

		part_to_be_inserted.user_id = user.userId
		part_to_be_inserted.timestamp = +new Date

		self.resolve_part_color(part)

		part_to_be_inserted.part = part
		self.parts_collection.insert(part_to_be_inserted, () => {
			resolve(part_to_be_inserted)
		})
	})

}

parts_manager.prototype.get_parts = function (user_id) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.parts_collection.find({user_id: user_id}).toArray((err, parts) => {
			if (err) { return reject(err) }

			resolve(parts)
		})
	})
}

parts_manager.prototype.resolve_part_color = function (part) {
	var self = this

	var rebrickable_category = part.category

	var legolabels_category = _.find(self.categories, {rebrickable_category: rebrickable_category})

	var color_code = 8 // default to black color

	// set the color code to the predefined
	if (legolabels_category) {
		color_code = legolabels_category.lego_color
	}

	// checks if parts is available in that color and pick the closest if not
	closest_color = _.chain(part.colors).sortBy(function (color) {
		return Math.abs(parseInt(color.rb_color_id) - color_code)
	}).value()[0]

	color_code = closest_color.rb_color_id

	part.image = self.get_image_url(color_code, part.part_id)
	part.color_code = color_code
	part.color_name = closest_color.color_name
}

parts_manager.prototype.get_image_url = function (color_code, part_id) {
	return 'https://rebrickable.com/img/pieces/' + color_code + '/' + part_id + '.png'
}

parts_manager.prototype.delete_part = function (part_id) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.parts_collection.remove({_id: object_id(part_id)}, () => {
			resolve()
		})
	})
}

parts_manager.prototype.update_color = function (part_id, new_color) {
	var self = this

	return new Promise(function (resolve, reject) {

		var new_image_url = self.get_image_url(new_color.color_code, new_color.part_id)

		var updated_attributes = {
			'part.image': new_image_url,
			'part.color_code': new_color.color_code,
			'part.color_name': new_color.color_name,
		}

		self.parts_collection.update({_id: object_id(part_id)}, { $set: updated_attributes }, () => {
			resolve({new_image_url: new_image_url})
		})
	})
}

module.exports = new parts_manager()

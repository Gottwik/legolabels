var parts_manager = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')
var object_id = require('mongodb').ObjectId
var _ = require('lodash')
var request = require('request')

parts_manager.prototype.init = function (db) {
	var self = this
	self.parts_collection = db.collection('legolabels_parts')

	// load categories
	fs.readFile(path.join(CMD_FOLDER, 'app', 'data', 'categories.json'), 'utf8', function (err, categories) {
		if (err) { console.log(err) }

		self.categories = JSON.parse(categories)
	})

	// load colors
	fs.readFile(path.join(CMD_FOLDER, 'app', 'data', 'colors.json'), 'utf8', function (err, colors) {
		if (err) { console.log(err) }

		self.colors = JSON.parse(colors)
	})
}

parts_manager.prototype.add_part = function (part_id, user_id) {
	var self = this

	part_to_be_inserted = {}

	part_to_be_inserted.user_id = user_id
	part_to_be_inserted.timestamp = +new Date

	return self.get_part_by_part_id(part_id)
		.then((part) => {
			return self.resolve_part_image(part) // adds image to part
		})
		.then((part) => {
			return new Promise(function (resolve, reject) {

				part_to_be_inserted.part = part

				// inserts into db
				self.parts_collection.insert(part_to_be_inserted, () => {
					resolve(part_to_be_inserted)
				})
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

parts_manager.prototype.resolve_part_image = function (part) {
	var self = this

	return new Promise(function (resolve, reject) {
		var color_code = 8 // default to black color

		var category = _.find(self.categories, {desc: part.category})

		// set the color code to the predefined
		if (category) {
			color_code = category.lego_color
		}

		// checks if parts is available in that color and pick the closest if not
		closest_color = _.chain(part.colors).sortBy(function (color) {
			return Math.abs(parseInt(color.rb_color_id) - color_code)
		}).value()[0]

		color_code = closest_color.rb_color_id

		part.color_code = color_code
		part.color_name = closest_color.color_name

		self.get_image_url(part)
			.then((image) => {
				part.image = image
				resolve(part)
			})
	})
}

parts_manager.prototype.get_image_url = function (part) {
	return new Promise(function (resolve, reject) {
		var image = 'https://rebrickable.com/img/pieces/' + part.color_code + '/' + part.part_id + '.png'

		request(image, function (error, response, body) {
			if (error || response.statusCode != 200 || response.headers['content-type'].indexOf('image/png') == -1) {
				return resolve(part.part_img_url)
			}

			return resolve(image)
		})

	})
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

	return self.get_part_by_part_id(new_color.part_id)
		.then((part) => {
			part.color_code = new_color.color_code
			return self.get_image_url(part)
		})
		.then((new_image_url) => {
			console.log(new_image_url)
			return new Promise(function (resolve, reject) {

				var updated_attributes = {
					'part.image': new_image_url,
					'part.color_code': new_color.color_code,
					'part.color_name': new_color.color_name,
				}

				self.parts_collection.update({_id: object_id(part_id)}, { $set: updated_attributes }, () => {
					resolve({new_image_url: new_image_url})
				})
			})
		})
}

parts_manager.prototype.get_part_by_part_id = function (part_id) {
	return new Promise(function (resolve, reject) {

		var part_request_options = {
			key: 'Ajz15RKnAW',
			format: 'json',
			part_id: part_id,
		}

		request.get({
			url: 'https://rebrickable.com/api/get_part',
			qs: part_request_options
		}, function (error, response, body) {
			if (error || response.statusCode != 200) {
				return reject()
			}

			var parsed_part = JSON.parse(body)

			resolve(parsed_part)
		})
	})
}

module.exports = new parts_manager()

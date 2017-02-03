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

// As we try to group parts by category by using the same color
// this function tries to set the color of the part
// and tries to find the closest color if category color
// is not available
parts_manager.prototype.resolve_part_image = function (part) {
	var self = this

	return new Promise(function (resolve, reject) {
		// default to black color
		var color_code = 8

		// finds and stores category of the image
		var category = self.categories[part.part_cat_id]

		// set the color code to the predefined
		if (category) {
			color_code = category.lego_color
		}

		// checks if parts is available in that color and pick the closest if not
		closest_color = _.chain(part.colors).sortBy(function (color) {
			return Math.abs(parseInt(color.color_id) - color_code)
		}).value()[0]

		part.color_code = closest_color.color_id
		part.color_name = closest_color.color_name

		part.category = category.name
		part.category_color = '#' + _.find(self.colors, {rb_color_id: part.color_code.toString()}).rgb

		part.image = closest_color.part_img_url

		resolve(part)
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
			console.log(part)
			part.color_code = new_color.color_code
			return self.get_image_url(part)
		})
		.then((new_image_url) => {
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
			part_num: part_id,
		}

		request.get({
			url: 'https://rebrickable.com/api/v3/lego/parts/',
			qs: part_request_options
		}, function (error, response, body) {
			if (error || response.statusCode != 200) {
				return reject()
			}

			var parsed_part = JSON.parse(body).results[0]

			request.get({
				url: 'https://rebrickable.com/api/v3/lego/parts/' + part_id + '/colors/',
				qs: part_request_options
			}, function (error, response, body) {
				if (error || response.statusCode != 200) {
					return reject()
				}

				parsed_part.colors = JSON.parse(body).results

				resolve(parsed_part)
			})

		})
	})
}

parts_manager.prototype.insert_firstlogin_parts = function (user_id) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.parts_collection.find({firstlogin_part: true}).toArray((err, firstlogin_parts) => {
			if (err) { return reject(err) }

			if (!firstlogin_parts.length) {
				resolve
			}

			_.map(firstlogin_parts, (part) => {
				part.user_id = user_id
				delete part.firstlogin_part
				delete part._id
			})

			self.parts_collection.insertMany(firstlogin_parts, () => {
				resolve()
			})
		})

	})
}

parts_manager.prototype.get_all_parts = function () {
	var self = this

	return self.parts_collection.find({}).toArray_async()
}

module.exports = new parts_manager()

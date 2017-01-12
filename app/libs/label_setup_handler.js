var label_setup_handler = function () {}

// vendor dependencies
var extend = require('extend')
var object_id = require('mongodb').ObjectId

label_setup_handler.prototype.init = function (db) {
	this.label_setup_collection = db.collection('label_setup_collection')
}

// units in mm
label_setup_handler.prototype.default_label_setup = {
	label_info: {
		name: 'default setup',
		product_link: '',
	},
	page_setup: {
		page_width: 210,
		page_height: 297,
		page_padding: 20,
	},
	label_size: {
		label_width: 50,
		label_height: 20,
	},
	label_layout: {
		image_padding: 1,
		label_part_id_y_offset: 2,
		image_percentage: .3,
		image_separation: .1,
		text_color: '#3498db',
	},
	markings: {
		crop_marks: true,
		label_border: true,
	},
	font_sizes: {
		part_id: .5,
		part_category: .25,
		part_name: .25,
		part_name_maxlength: 10,
	}
}

// local dependencies
label_setup_handler.prototype.extend_with_default = function (label_setup) {
	var self = this

	return extend(true, self.default_label_setup, label_setup)
}

label_setup_handler.prototype.add_label_setup = function (label_setup, user_id) {
	var self = this

	return new Promise(function (resolve, reject) {
		label_setup_to_be_inserted = {}

		label_setup_to_be_inserted.user_id = user_id
		label_setup_to_be_inserted.timestamp = +new Date

		label_setup_to_be_inserted.label_setup = label_setup
		self.label_setup_collection.insert(label_setup_to_be_inserted, () => {
			resolve()
		})
	})
}

label_setup_handler.prototype.get_label_setups = function (user_id) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.label_setup_collection.find({user_id: user_id}).toArray((err, label_setups) => {
			if (err) { return reject(err) }
			resolve(label_setups)
		})
	})
}

label_setup_handler.prototype.delete_setup = function (setup_id) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.label_setup_collection.remove({_id: object_id(setup_id)}, () => {
			resolve()
		})
	})
}

label_setup_handler.prototype.edit_setup = function (label_setup) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.label_setup_collection.update({_id: object_id(label_setup._id)}, { $set: {label_setup: label_setup.label_setup}}, () => {
			resolve()
		})
	})
}

module.exports = new label_setup_handler()

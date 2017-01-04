var label_setup_handler = function () {}

// vendor dependencies
var extend = require('extend')

// local dependencies
label_setup_handler.prototype.extend_with_default = function (label_setup) {

	// units in mm
	const default_label_setup = {
		label_width: 50,
		label_height: 20,
		page_width: 210,
		page_height: 297,
		page_padding: 20,
		crop_marks: true,
		label_border: true,
	}

	return extend(true, label_setup, default_label_setup)
}

module.exports = new label_setup_handler()

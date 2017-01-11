var labels_printer = function () {}

// vendor dependencies
var pdfkit = require('pdfkit')
var http = require('http')
var fs = require('fs')

// local dependencies
var label_setup_handler = require('./label_setup_handler')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

labels_printer.prototype.print_labels = function (parts, label_setup, res) {

	// extend provided settings with default settings
	label_setup_handler.extend_with_default(label_setup)

	// initialize the pdfkit
	var doc = new pdfkit({
		size: [mm(label_setup.page_width), mm(label_setup.page_height)]
	})

	// makes the pdfkit write directly into response without saving the file
	doc.pipe(res)

	// set some headers
	res.statusCode = 200
	res.setHeader('Content-type', 'application/pdf')
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Content-disposition', 'inline; filename=labels.pdf')

	// render the labels
	print_labels(doc, parts, label_setup)
		.then(() => {
			// close up the pdf file
			doc.end()
		})

}

function get_part_image (image_url) {
	return new Promise(function (resolve, reject) {

		// use http
		image_url = image_url.replace('https', 'http')

		var system_prefix = CMD_FOLDER + '/'
		var output_filename = 'temp/' + image_url.substr(image_url.lastIndexOf('/') + 1)

		if (enduro_helpers.file_exists_sync(system_prefix + output_filename)) {
			resolve(output_filename)
		} else {
			var output_file = fs.createWriteStream(system_prefix + output_filename)

			enduro_helpers.ensure_directory_existence(system_prefix + output_filename)
				.then(() => {
					http.get(image_url)
					.on('response', function (res) {

						res.on('data', function (chunk) {
							output_file.write(chunk)
						})

						res.on('end', function () {
							output_file.end()
							resolve(output_filename)
						})

					}).end()
				})
		}
	})
}

function print_labels (doc, parts, label_setup) {
	return new Promise(function (resolve, reject) {

		var label_variables = {}

		// * ———————————————————————————————————————————————————————— * //
		// * 	constants
		// * ———————————————————————————————————————————————————————— * //
		label_variables.image_percentage = 0.3

		// * ———————————————————————————————————————————————————————— * //
		// * 	precalculates variables
		// * ———————————————————————————————————————————————————————— * //
		label_variables.number_of_parts = parts.length

		// page width without the margins
		label_variables.clean_page_width = label_setup.page_width - label_setup.page_padding * 2

		label_variables.number_of_cols = Math.min(label_variables.number_of_parts, Math.floor(label_variables.clean_page_width / label_setup.label_width))

		label_variables.number_of_rows = Math.ceil(label_variables.number_of_parts / label_variables.number_of_cols)

		label_variables.label_area_height = label_variables.number_of_rows * label_setup.label_height
		label_variables.label_area_width = label_variables.number_of_cols * label_setup.label_width

		label_variables.start_x = (label_setup.page_width - label_variables.label_area_width) / 2
		label_variables.start_y = (label_setup.page_height - label_variables.label_area_height) / 2

		// * ———————————————————————————————————————————————————————— * //
		// * 	crop marks
		// * ———————————————————————————————————————————————————————— * //
		if (label_setup.crop_marks) {

			// horizontal crop marks
			for (current_row in _.range(label_variables.number_of_rows + 1)) {
				doc
					.moveTo(mm(label_variables.start_x - 13), mm(label_variables.start_y + label_setup.label_height * current_row))
					.lineTo(mm(label_variables.start_x - 3), mm(label_variables.start_y + label_setup.label_height * current_row))

				doc
					.moveTo(mm(label_variables.start_x + label_variables.number_of_cols * label_setup.label_width + 3), mm(label_variables.start_y + label_setup.label_height * current_row))
					.lineTo(mm(label_variables.start_x + label_variables.number_of_cols * label_setup.label_width + 13), mm(label_variables.start_y + label_setup.label_height * current_row))
			}

			// vertical crop marks
			for (current_col in _.range(label_variables.number_of_cols + 1)) {
				doc
					.moveTo(mm(label_variables.start_x + label_setup.label_width * current_col), mm(label_variables.start_y - 13))
					.lineTo(mm(label_variables.start_x + label_setup.label_width * current_col), mm(label_variables.start_y - 3))

				doc
					.moveTo(mm(label_variables.start_x + label_setup.label_width * current_col), mm(label_variables.start_y + label_setup.label_height * label_variables.number_of_rows + 3))
					.lineTo(mm(label_variables.start_x + label_setup.label_width * current_col), mm(label_variables.start_y + label_setup.label_height * label_variables.number_of_rows + 13))

			}
		}

		// * ———————————————————————————————————————————————————————— * //
		// * 	labels
		// * ———————————————————————————————————————————————————————— * //

		var label_promises = []

		var current_part = 0
		var current_col = 0
		var current_row = 0
		_.each(parts, (part) => {

			label_promises.push(print_part(doc, part.part, label_setup, label_variables, current_col, current_row))

			current_part++
			current_col = current_part % label_variables.number_of_cols
			current_row = Math.floor(current_part / label_variables.number_of_cols)
		})

		Promise.all(label_promises)
			.then(() => {
				resolve()
			})
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	print part
// * ———————————————————————————————————————————————————————— * //
function print_part (doc, part, label_setup, label_variables, current_col, current_row) {
	return new Promise(function (resolve, reject) {

		// calculates the label top left position
		var current_x = label_variables.start_x + current_col * label_setup.label_width
		var current_y = label_variables.start_y + label_setup.label_height * current_row

		// set the font
		doc.font('assets/fonts/Lato-Light.ttf')

		// * ———————————————————————————————————————————————————————— * //
		// * 	part id
		// * ———————————————————————————————————————————————————————— * //
		doc
			.fontSize(label_setup.label_height * label_setup.part_font_size)
			.text(
				part.part_id,
				mm(current_x + label_setup.label_width * label_variables.image_percentage),
				mm(current_y + label_setup.label_id_y_offset), {
					align: 'center',
					width: mm(label_setup.label_width * (1 - label_variables.image_percentage)),
				}
			)

		// * ———————————————————————————————————————————————————————— * //
		// * 	part name
		// * ———————————————————————————————————————————————————————— * //
		doc
			.fontSize(label_setup.label_height / 2 * label_setup.part_font_size)
			.text(
				part.name,
				mm(current_x + label_setup.label_width * label_variables.image_percentage),
				mm(current_y + label_setup.label_height / 2), {
					align: 'center',
					width: mm(label_setup.label_width * (1 - label_variables.image_percentage)),
				}
			)

		// * ———————————————————————————————————————————————————————— * //
		// * 	border
		// * ———————————————————————————————————————————————————————— * //
		if (label_setup.label_border) {
			doc
				.lineWidth(1)
				.rect(
					mm(current_x),
					mm(current_y),
					mm(label_setup.label_width),
					mm(label_setup.label_height)
				)
				.stroke()
		}

		// * ———————————————————————————————————————————————————————— * //
		// * 	image
		// * ———————————————————————————————————————————————————————— * //
		get_part_image(part.image)
			.then((image_buffer) => {

				var image_area_width = label_setup.label_width * label_variables.image_percentage

				// image area is higher than wide
				var image_x_offset = label_setup.image_padding
				var image_size = image_area_width - label_setup.image_padding * 2
				var image_y_offset = (label_setup.label_height - image_size) / 2

				// image area is wider than high
				if (image_area_width > label_setup.label_height) {

				}

				// image
				doc
					.image(
						image_buffer,
						mm(current_x + image_x_offset),
						mm(current_y + image_y_offset), {
							width: mm(image_size),
							height: mm(image_size)
						}
					)
				resolve()
			})

	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	helper functions
// * ———————————————————————————————————————————————————————— * //

// returns points from mm because pdfkit uses pdf points at 72 dpi
function mm (mms) {
	return (mms * 72) / 25.4
}

module.exports = new labels_printer()

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
		size: [mm(label_setup.page_setup.page_width), mm(label_setup.page_setup.page_height)]
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
		var output_filename = 'temp/' + image_url.split(/\//).splice(-2, 2).join('_')

		console.log('trying to save an image', output_filename)

		console.log('checking if file exists', enduro_helpers.file_exists_sync(system_prefix + output_filename))

		if (enduro_helpers.file_exists_sync(system_prefix + output_filename)) {
			console.log('file exists')
			resolve(output_filename)
		} else {
			var output_file = fs.createWriteStream(system_prefix + output_filename)
			console.log('file does not exist')

			console.log('ensuring directory existence', system_prefix + output_filename)
			enduro_helpers.ensure_directory_existence('app')
				.then(() => {
					console.log('file exists')
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
		// * 	preps doc
		// * ———————————————————————————————————————————————————————— * //
		doc.lineWidth(.1)

		// * ———————————————————————————————————————————————————————— * //
		// * 	constants
		// * ———————————————————————————————————————————————————————— * //
		label_variables.image_width = 100
		label_variables.image_height = 75

		// * ———————————————————————————————————————————————————————— * //
		// * 	precalculates variables
		// * ———————————————————————————————————————————————————————— * //
		label_variables.number_of_parts = parts.length

		// page width without the margins
		label_variables.clean_page_width = label_setup.page_setup.page_width - label_setup.page_setup.page_padding * 2

		label_variables.number_of_cols = Math.min(label_variables.number_of_parts, Math.floor(label_variables.clean_page_width / label_setup.label_size.label_width))

		label_variables.number_of_rows = Math.ceil(label_variables.number_of_parts / label_variables.number_of_cols)

		label_variables.label_area_height = label_variables.number_of_rows * label_setup.label_size.label_height
		label_variables.label_area_width = label_variables.number_of_cols * label_setup.label_size.label_width

		label_variables.start_x = (label_setup.page_setup.page_width - label_variables.label_area_width) / 2
		label_variables.start_y = (label_setup.page_setup.page_height - label_variables.label_area_height) / 2

		label_variables.image_ratio = label_variables.image_width / label_variables.image_height

		label_variables.text_block_start_x = label_setup.label_size.label_width * (label_setup.label_layout.image_percentage + label_setup.label_layout.image_separation)

		label_variables.category_stamp_radius = 2

		// * ———————————————————————————————————————————————————————— * //
		// * 	crop marks
		// * ———————————————————————————————————————————————————————— * //
		if (label_setup.markings.crop_marks) {

			// horizontal crop marks
			for (current_row in _.range(label_variables.number_of_rows + 1)) {
				doc
					.moveTo(mm(label_variables.start_x - 13), mm(label_variables.start_y + label_setup.label_size.label_height * current_row))
					.lineTo(mm(label_variables.start_x - 3), mm(label_variables.start_y + label_setup.label_size.label_height * current_row))
					.stroke()

				doc
					.moveTo(mm(label_variables.start_x + label_variables.number_of_cols * label_setup.label_size.label_width + 3), mm(label_variables.start_y + label_setup.label_size.label_height * current_row))
					.lineTo(mm(label_variables.start_x + label_variables.number_of_cols * label_setup.label_size.label_width + 13), mm(label_variables.start_y + label_setup.label_size.label_height * current_row))
					.stroke()
			}

			// vertical crop marks
			for (current_col in _.range(label_variables.number_of_cols + 1)) {
				doc
					.moveTo(mm(label_variables.start_x + label_setup.label_size.label_width * current_col), mm(label_variables.start_y - 13))
					.lineTo(mm(label_variables.start_x + label_setup.label_size.label_width * current_col), mm(label_variables.start_y - 3))
					.stroke()

				doc
					.moveTo(mm(label_variables.start_x + label_setup.label_size.label_width * current_col), mm(label_variables.start_y + label_setup.label_size.label_height * label_variables.number_of_rows + 3))
					.lineTo(mm(label_variables.start_x + label_setup.label_size.label_width * current_col), mm(label_variables.start_y + label_setup.label_size.label_height * label_variables.number_of_rows + 13))
					.stroke()

			}
		}

		// * ———————————————————————————————————————————————————————— * //
		// * 	legolabels stamp
		// * ———————————————————————————————————————————————————————— * //
		doc
			.image(
				CMD_FOLDER + '/assets/img/pdf_elements/pdf_stamp.png',
				mm(label_setup.page_setup.page_width - 55),
				mm(15), {
					width: mm(40)
				}
			)

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
		var current_x = label_variables.start_x + current_col * label_setup.label_size.label_width
		var current_y = label_variables.start_y + label_setup.label_size.label_height * current_row

		// set the font
		doc.font('assets/fonts/Lato-Regular.ttf')

		// * ———————————————————————————————————————————————————————— * //
		// * 	white background
		// * ———————————————————————————————————————————————————————— * //
		doc
			.rect(
				mm(current_x),
				mm(current_y),
				mm(label_setup.label_size.label_width),
				mm(label_setup.label_size.label_height)
			)
			.fill('white')

		// * ———————————————————————————————————————————————————————— * //
		// * 	part id
		// * ———————————————————————————————————————————————————————— * //
		doc
			.fillColor(label_setup.label_layout.text_color)
			.fontSize(process_font_size(label_setup.font_sizes.part_id))
			.text(
				part.part_id,
				mm(current_x + label_variables.text_block_start_x),
				mm(current_y + label_setup.label_layout.label_part_id_y_offset)
			)

		// * ———————————————————————————————————————————————————————— * //
		// * 	part category
		// * ———————————————————————————————————————————————————————— * //
		doc
			.fontSize(process_font_size(label_setup.font_sizes.part_category))
			.text(
				part.category,
				mm(current_x + label_variables.text_block_start_x),
				mm(current_y + label_setup.label_size.label_height / 2)
			)

		// * ———————————————————————————————————————————————————————— * //
		// * 	part name
		// * ———————————————————————————————————————————————————————— * //
		doc
			.fontSize(process_font_size(label_setup.font_sizes.part_name))
			.text(
				cutoff(part.name, label_setup.font_sizes.part_name_maxlength),
				mm(current_x + label_variables.text_block_start_x),
				mm(current_y + label_setup.label_size.label_height / 3 * 2), {
					width: mm(500),
				}
			)

		// * ———————————————————————————————————————————————————————— * //
		// * 	category stamp
		// * ———————————————————————————————————————————————————————— * //
		if (part.category_color) {
			doc
				.lineWidth(mm(.5))
				.circle(
					mm(current_x + label_setup.label_size.label_width - label_variables.category_stamp_radius - 1),
					mm(current_y + label_variables.category_stamp_radius + 1),
					mm(label_variables.category_stamp_radius)
				)
				.fillAndStroke(part.category_color, '#666')
		}

		// * ———————————————————————————————————————————————————————— * //
		// * 	border
		// * ———————————————————————————————————————————————————————— * //
		if (label_setup.markings.label_border) {
			doc
				.rect(
					mm(current_x),
					mm(current_y),
					mm(label_setup.label_size.label_width),
					mm(label_setup.label_size.label_height)
				)
				.stroke()
		}

		// // * ———————————————————————————————————————————————————————— * //
		// // * 	image
		// // * ———————————————————————————————————————————————————————— * //
		get_part_image(part.image)
			.then((image_buffer) => {

				console.log('image should be downloaded...', image_buffer)

		// 		var image_area_width = label_setup.label_size.label_width * label_setup.label_layout.image_percentage

		// 		// image area is higher than wide
		// 		var image_width = image_area_width - label_setup.label_layout.image_padding * 2
		// 		var image_height = image_width / label_variables.image_ratio

		// 		var image_x_offset = label_setup.label_layout.image_padding
		// 		var image_y_offset = (label_setup.label_size.label_height - image_height) / 2

		// 		// image area is wider than high
		// 		if (image_area_width > label_setup.label_size.label_height) {

		// 		}

		// 		// image
		// 		doc
		// 			.image(
		// 				image_buffer,
		// 				mm(current_x + image_x_offset),
		// 				mm(current_y + image_y_offset), {
		// 					width: mm(image_width),
		// 					height: mm(image_height)
		// 				}
		// 			)
				resolve()
			})

		function process_font_size (font_size) {
			return font_size * label_setup.label_size.label_height * 2
		}
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	helper functions
// * ———————————————————————————————————————————————————————— * //

// returns points from mm because pdfkit uses pdf points at 72 dpi
function mm (mms) {
	return (mms * 72) / 25.4
}

// shortens text and adds ...
function cutoff (str, length) {

	// don't do anything if str is not longer than length
	if (str.length <= length) {
		return str
	}

	return str.substring(0, length - 3) + '...'
}

module.exports = new labels_printer()

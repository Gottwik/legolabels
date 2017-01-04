var labels_printer = function () {}

// vendor dependencies
var pdfkit = require('pdfkit')

// local dependencies
var label_setup_handler = require('./label_setup_handler')

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

	// close up the pdf file
	doc.end()
}

function print_labels (doc, parts, label_setup) {

	// * ———————————————————————————————————————————————————————— * //
	// * 	precalculates variables
	// * ———————————————————————————————————————————————————————— * //
	const number_of_parts = parts.length

	// page width without the margins
	const clean_page_width = label_setup.page_width - label_setup.page_padding * 2

	const number_of_cols = Math.min(number_of_parts, Math.floor(clean_page_width / label_setup.label_width))

	const number_of_rows = Math.ceil(number_of_parts / number_of_cols)

	const label_area_height = number_of_rows * label_setup.label_height
	const label_area_width = number_of_cols * label_setup.label_width

	const start_x = (label_setup.page_width - label_area_width) / 2
	const start_y = (label_setup.page_height - label_area_height) / 2

	// * ———————————————————————————————————————————————————————— * //
	// * 	crop marks
	// * ———————————————————————————————————————————————————————— * //
	if (label_setup.crop_marks) {

		// horizontal crop marks
		for (current_row in _.range(number_of_rows + 1)) {
			doc
				.moveTo(mm(start_x - 13), mm(start_y + label_setup.label_height * current_row))
				.lineTo(mm(start_x - 3), mm(start_y + label_setup.label_height * current_row))

			doc
				.moveTo(mm(start_x + number_of_cols * label_setup.label_width + 3), mm(start_y + label_setup.label_height * current_row))
				.lineTo(mm(start_x + number_of_cols * label_setup.label_width + 13), mm(start_y + label_setup.label_height * current_row))
		}

		// vertical crop marks
		for (current_col in _.range(number_of_cols + 1)) {
			doc
				.moveTo(mm(start_x + label_setup.label_width * current_col), mm(start_y - 13))
				.lineTo(mm(start_x + label_setup.label_width * current_col), mm(start_y - 3))

			doc
				.moveTo(mm(start_x + label_setup.label_width * current_col), mm(start_y + label_setup.label_height * number_of_rows + 3))
				.lineTo(mm(start_x + label_setup.label_width * current_col), mm(start_y + label_setup.label_height * number_of_rows + 13))

		}
	}

	// * ———————————————————————————————————————————————————————— * //
	// * 	labels
	// * ———————————————————————————————————————————————————————— * //
	var current_part = 0
	var current_x = 0
	var current_y = 0
	_.each(parts, (part) => {

		if (label_setup.label_border) {
			doc
				.lineWidth(1)
				.rect(
					mm(start_x + current_x * label_setup.label_width),
					mm(start_y + label_setup.label_height * current_y),
					mm(label_setup.label_width),
					mm(label_setup.label_height)
				)
				.stroke()

			current_part++
			current_x = current_part % number_of_cols
			current_y = Math.floor(current_part / number_of_cols)
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

module.exports = new labels_printer()

lego_labels.factory('print_service', function ($rootScope, $http, url_service, part_service) {
	var service = {}

	service.print_selected_labels = function (label_setup) {
		var self = this
		return self.print_labels(part_service.get_selected_parts(), label_setup)
	}

	service.print_labels = function (parts, label_setup) {

		var print_labels_options = {
			responseType: 'arraybuffer',
			params: {
				parts: JSON.stringify(parts),
				label_setup: label_setup
			}
		}

		return $http.get(url_service.get_url('print_labels'), print_labels_options)
			.then(function (data) {
				var blob = new Blob([data.data, { type: 'application/pdf' }])
				var link = document.createElement('a')
				link.href = window.URL.createObjectURL(blob)
				link.download = 'Labels.pdf'
				link.click()
			})
	}

	return service
})

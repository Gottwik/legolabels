lego_labels.factory('print_service', function ($rootScope, $http, url_service, part_service) {
	var service = {}

	service.print_selected_labels = function (label_setup) {
		var self = this
		return self.print_labels(part_service.get_selected_parts(), label_setup)
	}

	service.print_labels = function (parts, label_setup) {

		// strip colors to make the transfer package smaller
		// eventuelly this might have to be switched to post
		// to handle the data volume
		var request_parts = []
		_.map(parts, function (part) {
			filtered_part = _.cloneDeep(part)
			filtered_part.part.colors = []
			request_parts.push(filtered_part)
		})

		var print_labels_options = {
			responseType: 'arraybuffer',
			params: {
				parts: JSON.stringify(request_parts),
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

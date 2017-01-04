lego_labels.factory('print_service', function user_service ($http, user_service, url_service) {
	var service = {}

	service.print_labels = function (parts, label_setup) {
		return $http.get(url_service.get_url('print_labels'), {responseType: 'arraybuffer', params: {parts: JSON.stringify(parts), label_setup: label_setup}})
	}

	return service
})

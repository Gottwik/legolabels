lego_labels.factory('url_service', function user_service () {
	var service = {}

	var api_urls = {
		search_for_parts: 'https://rebrickable.com/api/get_part',
		add_part: '/add_part',
		get_parts: '/get_parts',
		print_labels: '/print_labels',
	}

	service.get_url = function (key) {
		return api_urls[key]
	}

	return service
})

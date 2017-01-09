lego_labels.factory('url_service', function user_service () {
	var service = {}

	var api_urls = {
		search_for_parts: 'https://rebrickable.com/api/get_part',
		add_part: '/add_part',
		get_parts: '/get_parts',
		print_labels: '/print_labels',
		get_default_setup: '/get_default_setup',
		add_label_setup: '/add_label_setup',
		get_setups: '/get_setups',
		delete_setup: '/delete_setup',
		edit_setup: '/edit_setup',
	}

	service.get_url = function (key) {
		return api_urls[key]
	}

	return service
})

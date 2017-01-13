lego_labels.factory('url_service', function () {
	var service = {}

	var api_urls = {
		search_for_parts: 'https://rebrickable.com/api/search',
		add_part: '/add_part',
		get_parts: '/get_parts',
		print_labels: '/print_labels',
		get_default_setup: '/get_default_setup',
		add_label_setup: '/add_label_setup',
		get_setups: '/get_setups',
		delete_setup: '/delete_setup',
		edit_setup: '/edit_setup',
		delete_part: '/delete_part',
		update_color: '/update_color',
		user_logged_in: '/user_logged_in',
	}

	service.get_url = function (key) {
		return api_urls[key]
	}

	return service
})

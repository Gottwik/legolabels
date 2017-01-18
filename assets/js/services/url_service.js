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
		var url = api_urls[key]

		// just return the url if it already contains http
		if (url.indexOf('http') + 1) {
			return url
		}

		// add the base to the url if it doesn't contian http
		return this.get_base_url() + url
	}

	service.get_base_url = function () {
		return (window.location.href.indexOf('localhost') + 1)
			?	'http://localhost:5000'
			:	''
	}

	return service
})

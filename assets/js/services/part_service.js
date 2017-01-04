lego_labels.factory('part_service', function user_service ($http, user_service, url_service) {
	var service = {}

	service.add_part = function (part, user) {
		return $http.get(url_service.get_url('add_part'), {params: {part: part, user: user}})
	}

	service.get_parts = function () {
		return $http.get(url_service.get_url('get_parts'), {params: {user_id: user_service.get_logged_in_user().user_id}})
	}

	return service
})

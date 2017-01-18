lego_labels.factory('label_service', function ($http, user_service, url_service) {
	var service = {}

	service.get_default_setup = function () {
		return $http.get(url_service.get_url('get_default_setup'))
	}

	service.add_label_setup = function (label_setup) {
		return $http.get(url_service.get_url('add_label_setup'), {params: {label_setup: label_setup, user_id: user_service.get_logged_in_user().user_id}})
	}

	service.get_setups = function () {
		return $http.get(url_service.get_url('get_setups'), {params: {user_id: user_service.get_logged_in_user().user_id}})
	}

	service.delete_setup = function (setup_id) {
		return $http.get(url_service.get_url('delete_setup'), {params: {setup_id: setup_id}})
	}

	service.edit_setup = function (label_setup) {
		return $http.get(url_service.get_url('edit_setup'), {params: {label_setup: label_setup}})
	}

	return service
})

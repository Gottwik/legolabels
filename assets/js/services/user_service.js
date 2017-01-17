lego_labels.factory('user_service', function ($http, store, authManager, $location, url_service) {
	var service = {}

	service.user_logged_in = function (user_id) {
		var self = this
		return $http.get(url_service.get_url('user_logged_in'), {params: {user: self.get_logged_in_user()}})
	}

	service.get_logged_in_user = function () {
		return store.get('profile')
	}

	service.logout = function () {
		store.remove('token')
		store.remove('profile')
		authManager.unauthenticate()
		$location.path('/')
	}

	return service
})

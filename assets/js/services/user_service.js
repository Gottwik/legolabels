lego_labels.factory('user_service', function user_service ($http, store, authManager, $location) {
	var service = {}

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

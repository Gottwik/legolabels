// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('login_controller', function ($scope, $rootScope, auth, $location, store, lock, user_service, part_service) {

	// binds the authenticated event
	lock.on('authenticated', function (authResult) {
		lock.getUserInfo(authResult.accessToken, function (err, profile) {
			if (err) { console.log(err) }

			store.set('profile', profile)
			store.set('token', authResult.id_token)
			user_service.user_logged_in()
				.then(function (user_logged_in_response) {
					$rootScope.first_login = user_logged_in_response.data.first_login
					$location.path('/app')
					introJs().start()
				})
		})
	})

	$scope.signin = function () {
		lock.show()
	}
})

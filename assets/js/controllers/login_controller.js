// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('login_controller', function ($scope, auth, $location, store, lock) {
	$scope.signin = function () {

		lock.show()

		lock.on('authenticated', function (authResult) {
			lock.getUserInfo(authResult.accessToken, function (err, profile) {
				if (err) { console.log(err) }

				store.set('profile', profile)
				store.set('token', authResult.id_token)
				$location.path('/app')
			})
		})

	}
})

// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('login_controller', function ($scope, auth, $location, store) {
	$scope.signin = function () {
		auth.signin({
			authParams: {
				scope: 'openid name email'
			}
		}, function (profile, id_token, access_token, state, refresh_token) {
			store.set('profile', profile)
			store.set('token', id_token)
			$location.path('/app')
		}, function (err) {
			console.log('Error :(', err)
		})
	}
})

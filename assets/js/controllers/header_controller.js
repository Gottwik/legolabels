// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('header_controller', function ($scope, $location, $rootScope, user_service) {
	$scope.user = user_service.get_logged_in_user()

	$scope.logout = function () {
		user_service.logout()
	}
})

// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('header_controller', function ($scope, $element, $location, $rootScope, user_service) {
	$scope.user = user_service.get_logged_in_user()
	$scope.profile_menu_open = false

	$scope.open_profile_menu = function () {
		$scope.profile_menu_open = !$scope.profile_menu_open
	}

	$scope.logout = function () {
		user_service.logout()
	}
})

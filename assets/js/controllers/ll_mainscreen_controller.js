// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('ll_mainscreen_controller', ['$scope', function ($scope) {

	$scope.$on('event:google-plus-signin-success', function (event,authResult) {
		console.log('login success')
		// Send login to server or save into cookie
	})

	$scope.$on('event:google-plus-signin-failure', function (event,authResult) {
		console.log('login fail')
		// Auth failure or signout detected
	})

}])

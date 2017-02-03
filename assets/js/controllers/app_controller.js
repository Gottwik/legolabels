// * ———————————————————————————————————————————————————————— * //
// * 	app controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('app_controller', function ($scope, $rootScope, $http, url_service) {
	$http.get(url_service.get_url('get_config'))
		.then(function (config_response) {
			$rootScope.rebrickable_api_key = config_response.data.rebrickable_api_key
		})

})

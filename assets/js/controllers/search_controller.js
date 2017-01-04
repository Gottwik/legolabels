// * ———————————————————————————————————————————————————————— * //
// * 	search controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('search_controller', function ($scope, $http, url_service, part_service, user_service) {

	var search_options = {
		params: {
			key: 'Ajz15RKnAW',
			format: 'json',
		}
	}

	$scope.$watch('searchtext', function (new_value, old_value) {
		if (new_value) {

			// set the part_id
			search_options.params.part_id = new_value

			$http.get(url_service.get_url('search_for_parts'), search_options)
				.then(function (data) {
					$scope.found_part = data.data
				})
		} else {
			$scope.found_part = {}
		}
	})

	$scope.add_part = function () {
		part_service.add_part($scope.found_part, user_service.get_logged_in_user())
			.then((response) => {
				$scope.found_part = {}
			})
	}
})

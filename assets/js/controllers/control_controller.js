// * ———————————————————————————————————————————————————————— * //
// * 	search controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('control_controller', function ($scope, $http, url_service, part_service, user_service, print_service) {

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

				// select the part
				$scope.found_part.selected = true

				// add the part to the beginning
				$('.parts').scope().parts.unshift($scope.found_part)

				// clear the search result to allow for subsequent searches
				$scope.found_part = {}
			})
	}

	$scope.print_labels = function () {
		var selected_parts = _.filter($('.parts').scope().parts, function (part) {
			return part.selected
		})

		if (selected_parts) {
			print_service.print_labels(selected_parts, {})
				.then(function (data) {
					var blob = new Blob([data.data, { type: 'application/pdf' }])
					var link = document.createElement('a')
					link.href = window.URL.createObjectURL(blob)
					link.download = 'Labels.pdf'
					link.click()
				})
		}

	}
})

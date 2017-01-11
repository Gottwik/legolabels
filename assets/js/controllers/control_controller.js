// * ———————————————————————————————————————————————————————— * //
// * 	search controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('control_controller', function ($scope, $http, url_service, part_service, user_service, print_service, modal_service, label_service) {

	label_service.get_setups()
		.then((label_setups_response) => {
			$scope.label_setups = label_setups_response.data
		})

	var search_options = {
		params: {
			key: 'Ajz15RKnAW',
			format: 'json',
		}
	}

	var search_trotter
	const THROTTLE_DELAY = 200

	$scope.$watch('searchtext', function (new_value, old_value) {
		$scope.found_part = {}
		if (new_value && new_value != old_value) {
			$scope.loading = true
			$scope.no_part = false

			clearTimeout(search_trotter)
			search_trotter = setTimeout(search_for_part, THROTTLE_DELAY, new_value)

		}
	})

	function search_for_part (part_id) {

		// set the part_id
		search_options.params.part_id = part_id

		$http.get(url_service.get_url('search_for_parts'), search_options)
			.then(function (data) {
				$scope.loading = false
				console.log(data)
				if (data.data == 'NOPART' || !data.data.name) {
					$scope.no_part = true
					$scope.found_part = {}
					return
				}

				$scope.found_part = data.data
			})
	}

	$scope.add_part = function () {

		$scope.searchtext = ''

		part_service.add_part($scope.found_part, user_service.get_logged_in_user())
			.then((response) => {

				var new_part = response.data.inserted_part

				// select the part
				new_part.selected = true

				// add the part to the beginning
				$('.parts').scope().parts.unshift(new_part)

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

	$scope.open_label_setup_editor = function () {
		modal_service.open('label_setup_editor')
	}
})

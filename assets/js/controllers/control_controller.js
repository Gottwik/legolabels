// * ———————————————————————————————————————————————————————— * //
// * 	search controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('control_controller', function ($scope, $rootScope, $http, url_service, part_service, user_service, print_service, modal_service, label_service, set_service) {

	label_service.get_setups()
		.then((label_setups_response) => {
			$scope.label_setups = label_setups_response.data
			if ($scope.label_setups.length) {
				$scope.selected_setup_id = $scope.label_setups[0]._id
			}
		})

	var search_options = {
		params: {
			format: 'json',
			type: 'P',
		}
	}

	var search_trotter // will store the timeout reference
	const THROTTLE_DELAY = 800 // time before searching for parts
	var last_query = ''

	trotted_watch('searchtext', search_for_part)
	trotted_watch('searchtext_set', search_for_set)

	function trotted_watch (variable_name, function_to_execute) {
		$scope.$watch(variable_name, function (new_value, old_value) {
			$scope.found_part = {}
			if (new_value && new_value != old_value) {
				$scope.loading = true
				$scope.no_part = false
				$scope.found_parts = []

				clearTimeout(search_trotter)
				search_trotter = setTimeout(function_to_execute, THROTTLE_DELAY, new_value)

			}
		})
	}

	function search_for_part (query) {

		// store the last query to only show last searched-for query
		// in case older search comes later
		last_query = query

		// set the query
		search_options.params.search = query
		search_options.search = query // to check which query it was
		search_options.params.key = $rootScope.rebrickable_api_key

		search_options.cache = true

		$http.get(url_service.get_url('search_for_parts'), search_options)
			.then(function (data) {
				// check if this result is for the last query
				if (data.config.search != last_query) {
					return
				}

				$scope.loading = false
				if (!data.data.results || data.data.results.length == 0) {
					$scope.no_part = true
					$scope.found_parts = []
					return
				}

				$scope.found_parts = _.take(data.data.results, 10)
			})
	}

	function search_for_set (query) {
		// store the last query to only show last searched-for query
		// in case older search comes later
		last_query = query

		// set the query
		search_options.params.key = $rootScope.rebrickable_api_key
		search_options.search = query // to check which query it was

		$http.get(url_service.get_url('search_for_sets') + query + '-1', search_options)
			.then(function (data) {
				// check if this result is for the last query
				if (data.config.search != last_query) {
					return
				}

				$scope.loading = false
				if (!data.data) {
					$scope.no_set = true
					$scope.found_set = []
					return
				}

				$scope.found_set = data.data
				console.log($scope.found_set)
			})
	}

	$scope.print_labels = function () {

		// find selected setup by it's id
		var selected_label_setup = _.find($scope.label_setups, {_id: $scope.selected_setup_id}).label_setup

		print_service.print_selected_labels(selected_label_setup)
	}

	$scope.add_part = function (part_id) {

		$scope.searchtext = ''
		$scope.found_parts = []
		$rootScope.loader_part = true

		part_service.add_part(part_id)
			.then((response) => {

				$rootScope.loader_part = false

				var new_part = response.data.inserted_part

				// select the part
				new_part.selected = true

				// add the part to the beginning
				$rootScope.parts.unshift(new_part)

				$('.search_box').focus()

			})
	}

	$scope.add_set = function (set_id) {

		$scope.searchtext_set = ''
		$scope.found_parts = []
		$rootScope.loader_part = true

		set_service.add_set(set_id)
			.then((response) => {
				$rootScope.loader_part = false

				var new_parts = response.data.inserted_parts

				$rootScope.parts.unshift(...new_parts)

				$('.search_box').focus()
			})
	}

	$scope.open_label_setup_editor = function () {
		modal_service.open('label_setup_editor')
	}

	$scope.clear_searchtext = function () {
		$scope.searchtext = ''
		$scope.found_parts = []
	}
})

lego_labels.factory('set_service', function ($rootScope, $http, user_service, url_service, part_service) {
	var service = {}

	service.add_set = function (set_id) {
		console.log('adding set', set_id)

		// get the parts of the set
		var search_options = {
			params: {
				format: 'json',
				type: 'P',
				key: $rootScope.rebrickable_api_key
			}
		}

		return $http.get(url_service.get_url('search_for_sets') + set_id + '/parts/', search_options)
			.then(function (data) {
				$rootScope.parts_to_process = data.data.results.length
				console.log($rootScope.parts_to_process)

				var part_ids = data.data.results.map(function (part) {
					return part.part.part_num
				})

				return part_service.add_parts(part_ids)
			})
	}

	return service
})

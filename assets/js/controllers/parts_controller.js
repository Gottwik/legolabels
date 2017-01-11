// * ———————————————————————————————————————————————————————— * //
// * 	parts controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('parts_controller', function ($scope, $rootScope, part_service) {

	$rootScope.parts = {}

	part_service.get_parts()
		.then(function (get_parts_response) {
			$rootScope.parts = get_parts_response.data.parts
		})

	$scope.select_app_parts = function () {
		_.map($rootScope.parts, function (part) {
			part.selected = true
		})
	}

	$scope.deselect_app_parts = function () {
		_.map($rootScope.parts, function (part) {
			part.selected = false
		})
	}

	$rootScope.get_selected_part_count = function () {
		return _.sumBy($rootScope.parts, function (part) { return part.selected ? 1 : 0 })
	}

})

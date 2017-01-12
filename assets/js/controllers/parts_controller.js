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
		part_service.select_all()
	}

	$scope.deselect_app_parts = function () {
		part_service.deselect_all()
	}

	$rootScope.get_selected_part_count = part_service.get_selected_part_count

})

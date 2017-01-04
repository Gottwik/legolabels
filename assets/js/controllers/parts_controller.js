// * ———————————————————————————————————————————————————————— * //
// * 	search controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('parts_controller', function ($scope, $http, url_service, part_service, user_service) {

	part_service.get_parts()
		.then(function (get_parts_response) {
			$scope.parts = get_parts_response.data.parts
		})

	$scope.select = function (part_id) {
		var found_part = _.find($scope.parts, {part_id: part_id})
		found_part.selected = found_part.selected ? false : true
	}
})

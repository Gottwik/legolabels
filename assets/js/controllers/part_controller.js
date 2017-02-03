// * ———————————————————————————————————————————————————————— * //
// * 	part controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('part_controller', function ($scope, $rootScope, part_service) {

	$scope.select = function ($event) {

		// shift key
		if ($rootScope.last_selected_part && $event.shiftKey) {

			var last_selected_part_index = $scope.parts.indexOf($rootScope.last_selected_part)
			var current_part_index = $scope.parts.indexOf($scope.part)

			var interval_start = Math.min(last_selected_part_index, current_part_index)
			var interval_end = Math.max(last_selected_part_index, current_part_index) + 1

			_.chain($scope.parts)
				.slice(interval_start, interval_end)
				.map(function (part) {
					part.selected = true
				})
				.value()

			return
		}

		// select only if overlay is not open
		if (!$scope.part.color_overlay_open) {
			$rootScope.last_selected_part = $scope.part
			$scope.part.selected = !$scope.part.selected
		}
	}

	$scope.delete = function () {
		var found_part_index = $scope.parts.indexOf($scope.part)
		$scope.parts.splice(found_part_index, 1)

		part_service.delete_part($scope.part._id)
			.then(function () {
				// hopefully went ok :-/
			})
	}

	$scope.choose_color = function () {
		$scope.part.color_overlay_open = true
	}

	$scope.close_color_overlay = function () {
		$scope.part.color_overlay_open = false
	}

	$scope.$watch('part.part.color_code', function (new_value, old_value) {

		// prevent updating color on the first update
		if (new_value == old_value) { return }

		var color_name = _.find($scope.part.part.colors, {rb_color_id: Number(new_value)}).color_name

		var new_color = {
			color_code: new_value,
			color_name: color_name,
			part_id: $scope.part.part.part_id,
		}

		part_service.update_color($scope.part._id, new_color)
			.then(function (color_change_response) {
				$scope.part.part.image = color_change_response.data.new_image_url
				$scope.close_color_overlay()
			})
	})

})

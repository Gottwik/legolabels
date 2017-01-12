// * ———————————————————————————————————————————————————————— * //
// * 	parts controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('setup_editor_control_controller', function ($scope) {
	$scope.control_type = 'text'

	if (typeof $scope.value === 'boolean') {
		$scope.control_type = 'checkbox'
	}

	if (typeof $scope.value === 'number') {
		$scope.control_type = 'number'
	}

})

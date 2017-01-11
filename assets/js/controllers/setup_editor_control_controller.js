// * ———————————————————————————————————————————————————————— * //
// * 	parts controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('setup_editor_control_controller', function ($scope) {
	$scope.control_type = 'number'

	if (typeof $scope.value === 'boolean') {
		$scope.control_type = 'checkbox'
	}
})

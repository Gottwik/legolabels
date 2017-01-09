// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('label_setup_editor_controller', function ($scope, label_service) {

	$scope.default_setup = {}

	label_service.get_default_setup()
		.then(function (default_setup) {
			$scope.default_setup = default_setup.data
		})

	$scope.setups = []

	label_service.get_setups()
		.then(function (setups) {
			$scope.setups = setups.data
		})

	$scope.delete_setup = function (setup) {
		label_service.delete_setup(setup._id)
			.then(function () {
				_.remove($scope.setups, function (iterated_setup) {
					return iterated_setup._id == setup._id
				})
			})
	}

	$scope.add_new_setup = function () {

		var new_setup = {
			name: $scope.new_setups_name,
			setup: $scope.default_setup
		}

		label_service.add_label_setup(new_setup)
			.then(function () {
				$scope.setups.push({label_setup: new_setup})
				$scope.new_setups_name = ''
			})
	}

	$scope.edit = function (setup) {
		$scope.being_edited_setup = setup
	}

	$scope.save_setup = function () {
		label_service.edit_setup($scope.being_edited_setup)
			.then(function () {
				$scope.being_edited_setup = false
			})
	}

})

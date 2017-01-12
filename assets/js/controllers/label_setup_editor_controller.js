// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('label_setup_editor_controller', function ($scope, label_service, print_service, part_service) {

	$scope.default_setup = {}

	label_service.get_default_setup()
		.then(function (default_setup) {
			$scope.default_setup = default_setup.data
		})

	$scope.setups = []

	label_service.get_setups()
		.then(function (setups) {
			$scope.setups = setups.data
			console.log($scope.setups)
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

		var new_setup = $scope.default_setup
		new_setup.label_info.name = $scope.new_setups_name

		label_service.add_label_setup(new_setup)
			.then(function () {
				$scope.setups.push({label_setup: new_setup})
				$scope.new_setups_name = ''
			})
	}

	$scope.edit = function (setup) {
		console.log(setup)
		$scope.being_edited_setup = setup
	}

	$scope.save_setup = function () {
		label_service.edit_setup($scope.being_edited_setup)
			.then(function () {
				$scope.being_edited_setup = false
			})
	}

	/**
	 * generates and triggers download of a pdf with current setup
	 * used to quickly setup the labels
	 */
	$scope.test_print = function () {
		print_service.print_labels(part_service.get_first_parts(), $scope.being_edited_setup.label_setup)
	}

	/**
	 * Formats slug nicely.
	 * Turns 'label_name' into 'Label name'
	 *
	 * @param      {string}  slug    input slug
	 *
	 * @return     {string} formatted output
	 */
	$scope.deslug = function (slug) {

		var deslugged = slug.replace(/_|-/g, ' ')
		deslugged = deslugged[0].toUpperCase() + deslugged.substring(1)

		return deslugged
	}

})

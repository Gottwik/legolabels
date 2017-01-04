// * ———————————————————————————————————————————————————————— * //
// * 	mainscreen controller
// * ———————————————————————————————————————————————————————— * //
lego_labels.controller('footer_controller', function ($scope, print_service) {
	$scope.print_labels = function () {
		var selected_parts = _.filter($('.parts').scope().parts, function (part) {
			return part.selected
		})

		if (selected_parts) {
			print_service.print_labels(selected_parts, {})
				.then(function (data) {
					var blob = new Blob([data.data, { type: 'application/pdf' }])
					var link = document.createElement('a')
					link.href = window.URL.createObjectURL(blob)
					link.download = 'Labels.pdf'
					link.click()
				})
		}

	}
})

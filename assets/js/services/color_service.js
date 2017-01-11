lego_labels.factory('color_service', function user_service () {
	var service = {}

	service.colors = ['#1abc9c', '#3498db', '#9b59b6', '#34495e', '#e74c3c', '#e67e22', '#27ae60', '#8e44ad', '#7f8c8d', '#16a085', '#c0392b']

	service.get_color = function (i) {
		var self = this

		return self.colors[i % self.colors.length]
	}

	return service
})

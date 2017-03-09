lego_labels.factory('part_service', function ($rootScope, $http, user_service, url_service) {
	var service = {}

	service.add_part = function (part_id) {
		return $http.get(url_service.get_url('add_part'), {params: {part_id: part_id, user_id: user_service.get_logged_in_user().user_id}})
	}

	service.add_parts = function (part_ids) {
		return $http.get(url_service.get_url('add_parts'), {params: {part_ids: part_ids, user_id: user_service.get_logged_in_user().user_id}})
	}

	service.get_parts = function () {
		return $http.get(url_service.get_url('get_parts'), {params: {user_id: user_service.get_logged_in_user().user_id}})
	}

	service.delete_part = function (part_id) {
		return $http.get(url_service.get_url('delete_part'), {params: {part_id: part_id}})
	}

	service.update_color = function (part_id, new_color) {
		return $http.get(url_service.get_url('update_color'), {params: {part_id: part_id, new_color: new_color}})
	}

	service.get_selected_parts = function () {
		return _.filter($rootScope.parts, function (part) {
			return part.selected
		})
	}

	service.get_selected_part_count = function () {
		return _.sumBy($rootScope.parts, function (part) { return part.selected ? 1 : 0 })
	}

	service.deselect_all = function () {
		_.map($rootScope.parts, function (part) {
			part.selected = false
		})
	}

	service.select_all = function () {
		_.map($rootScope.parts, function (part) {
			part.selected = true
		})
	}

	service.get_first_parts = function (count) {
		count = count || 6

		return _.take($rootScope.parts, count)
	}

	service.delete_selected = function () {
		var selected_part_ids = this.get_selected_parts().map((part) => {
			return part['_id']
		})

		return $http.get(url_service.get_url('delete_parts'), {params: {part_ids: selected_part_ids}})
			.then(function () {
				_.remove($rootScope.parts, function (part) {
					return part.selected
				})
			})
	}

	return service
})

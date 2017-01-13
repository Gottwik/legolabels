var user_manager = function () {}

// vendor dependencies
var Promise = require('bluebird')

user_manager.prototype.init = function (db) {
	var self = this
	self.user_collection = db.collection('legolabels_users')
}

user_manager.prototype.user_logged_in = function (user_id) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.user_collection.find({ user_id: user_id }).toArray((err, users) => {
			if (err) { return reject(err) }

			var user_status = {
				first_login: false
			}

			if (!users.length) {
				user_status.first_login = true
				self.user_collection.insert({ user_id: user_id }, () => {
					self.users_first_login(user_id)
						.then(() => {
							resolve(user_status)
						})
				})
			} else {
				resolve(user_status)
			}

		})
	})
}

user_manager.prototype.users_first_login = function (user_id) {
	first_login_actions = []

	first_login_actions.push(parts_manager.insert_firstlogin_parts(user_id))
	first_login_actions.push(label_setup_handler.insert_firstlogin_setups(user_id))

	return Promise.all(first_login_actions)
}

module.exports = new user_manager()

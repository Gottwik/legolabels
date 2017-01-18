var user_manager = function () {}

// vendor dependencies
var Promise = require('bluebird')
var _ = require('lodash')

user_manager.prototype.init = function (db) {
	var self = this
	self.user_collection = db.collection('legolabels_users')
}

user_manager.prototype.user_logged_in = function (user) {
	var self = this

	return new Promise(function (resolve, reject) {
		self.user_collection.find({ user_id: user.userId }).toArray((err, users) => {
			if (err) { return reject(err) }

			var user_status = {
				first_login: false
			}

			if (!users.length) {
				user_status.first_login = true
				self.user_collection.insert({ user_id: user.userId, profile: users[0] }, () => {
					self.users_first_login(user.userId)
						.then(() => {
							resolve(user_status)
						}, (e) => {
							resolve({success: false, message: e})
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

user_manager.prototype.get_all_users = function () {
	var self = this

	return self.user_collection.find({}).toArray_async()
}

user_manager.prototype.get_user_count = function () {
	var self = this

	return Promise.join(self.get_all_users(), parts_manager.get_all_parts(), label_setup_handler.get_all_setups())
		.then((res) => {
			var users = JSON.parse(JSON.stringify(res[0]))
			var parts = JSON.parse(JSON.stringify(res[1]))
			var setups = JSON.parse(JSON.stringify(res[2]))

			parts = _.chain(parts)
				.filter((part) => {
					return part.user_id
				})
				.groupBy('user_id')
				.value()

			setups = _.chain(setups)
				.filter((part) => {
					return part.user_id
				})
				.groupBy('user_id')
				.value()

			console.log(setups)

			return {
				parts: parts,
				setups: setups
			}

		})
}

module.exports = new user_manager()

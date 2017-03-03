var preflight_check = function () {}

// vendor dependencies
logger = enduro.api.logger

preflight_check.prototype.check = function (DATABASE_URL) {
	if (!DATABASE_URL) {
		logger.err('DATABASE_URL not configured. Read more at: https://github.com/Gottwik/legolabels/blob/master/README.md#setting-mongodb')
	}
}

module.exports = new preflight_check()

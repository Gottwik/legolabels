lego_labels = angular
	.module('lego_labels', ['ngRoute', 'auth0.lock', 'ngCookies', 'auth0', 'angular-storage', 'angular-jwt'], function ($rootScopeProvider) {})

// routing configuration
lego_labels
	.config(function ($routeProvider, authProvider, lockProvider) {

		$routeProvider
			.when('/', {
				templateUrl: '/layout/home',
				controller: 'login_controller'
			})
			.when('/app', {
				templateUrl: '/layout/app',
				// controller: 'pagesplit_controller'
			})
			.otherwise({ redirectTo: '/' })

		lockProvider.init({
			domain: 'legolabels.eu.auth0.com',
			clientID: 'AtVGcLisv5hrs32LGSbJt2oBACFSn9OJ',
			options: {
				theme: {
					logo: 'http://logonoid.com/images/fanta-logo.png',
					primaryColor: '#b81b1c'
				},
				languageDictionary: {
					title: 'Log me in'
				}
			}
		})

		authProvider.init({
			domain: 'legolabels.eu.auth0.com',
			clientID: 'AtVGcLisv5hrs32LGSbJt2oBACFSn9OJ',
			loginUrl: '/',
		})

	})
	.run(function (auth) {
		auth.hookEvents()
	})

	.run(function ($rootScope, auth, store, jwtHelper, $location) {
		// This events gets triggered on refresh or URL change
		$rootScope.$on('$locationChangeStart', function () {
			var token = store.get('token')
			if (token) {
				if (!jwtHelper.isTokenExpired(token)) {
					if (!auth.isAuthenticated) {
						auth.authenticate(store.get('profile'), token).then(function (profile) {

							$location.path('/app')

						}, function (err) {
							console.log(err)
						})
					}
				} else {
					$location.path('/')
				}
			}
		})
	})

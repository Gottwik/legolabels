lego_labels = angular
	.module('lego_labels', ['ngRoute', 'auth0.lock', 'ngCookies', 'auth0', 'angular-storage', 'angular-jwt'], function ($rootScopeProvider) {})

// routing configuration
lego_labels
	.config(function ($routeProvider, lockProvider, $locationProvider) {

		$locationProvider.hashPrefix('')
		$routeProvider
			.when('/', {
				templateUrl: '/layout/home',
				controller: 'login_controller'
			})
			.when('/app', {
				templateUrl: '/layout/app',
			})
			.when('/blog', {
				templateUrl: '/layout/blog',
			})
			.when('/blog/:blog_slug', {
				templateUrl: function (params) { return '/blog/' + params.blog_slug },
			})
			.otherwise({ redirectTo: '/' })

		lockProvider.init({
			domain: 'legolabels.eu.auth0.com',
			clientID: 'AtVGcLisv5hrs32LGSbJt2oBACFSn9OJ',
			options: {
				autoclose: true,
				auth: {
					redirect: false,
					params: {
						scope: 'openid email user_metadata app_metadata picture',
					},
				},
				theme: {
					logo: '/assets/img/logo/signin_logo.png',
					primaryColor: '#3498db',
				},
				languageDictionary: {
					title: 'Sort your LEGO like a pro'
				},
			}
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

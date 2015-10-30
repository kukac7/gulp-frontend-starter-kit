if ( Raven )
	Raven.config('').install();

var tplURL = 'partials/';
var app = angular.module('app', ['ngRoute', 'ngResource', 'ngSanitize', 'ngCookies', 'ui.bootstrap', 'angulartics', 'angulartics.google.analytics']);

app.config(function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl: tplURL + 'fooldal.html'
		})

		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true).hashPrefix('!');

});

app.factory('$exceptionHandler', function ($window, $log) {

	return function (exception, cause) {

		$log.error.apply($log, arguments);

		if ( $window.Raven )
			Raven.captureException(exception);
	};

});

app.controller('page', function($scope, $location) {

	$scope.$on('$routeChangeSuccess', function(){
		if($location.path() == '/') {
			$scope.pageClass = ('fooldal');
		}
		else {
			$scope.pageClass = $location.path().replace('/', '');
		}
		console.log($scope.pageClass);
	});

});

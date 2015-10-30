app.controller('navigation', function($scope, $location) {

	console.log('nav');
	$scope.isCollapsed = true;
	$scope.activeClass = null;
	$scope.$on('$routeChangeSuccess', function() {
		var hash = $location.path();
		console.log(hash);
		$scope.activeClass = hash === '' || hash === '/' ? '/': hash;
		$scope.isCollapsed = true;
	});

});

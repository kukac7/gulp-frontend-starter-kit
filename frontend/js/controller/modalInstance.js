app.controller('modalInstance', function($scope, $uibModalInstance) {

	console.log($scope.modalSection);

	$scope.close = function() {
		$uibModalInstance.close();
	};

});

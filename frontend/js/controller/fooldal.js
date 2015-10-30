app.controller('fooldal', function($scope, httpService, $uibModal) {

	console.log('fooldal');
	$scope.hello = 'world';

	httpService.get(
		{
			url: 'api/gallery/random',
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		}
	);

	$scope.openImage = function(id) {
		httpService.get(
			{
				url: 'api/photo/' + id,
				success: function(data) {
					console.log(data);
					$scope.imgData = data.data;
					$scope.openModal('galleryImg');
				},
				error: function(data) {
					console.log(data);
				}
			}
		);
	};

	$scope.openModal = function(id) {
		console.log(id);
		$scope.modalSection = id;

		$uibModal.open({
			templateUrl: tplURL + 'modal.html',
			controller: 'modalInstance',
			scope: $scope
		});
	};

});

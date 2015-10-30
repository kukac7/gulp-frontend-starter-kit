app.factory('httpService', function($http) {

	var HTTP = {};
	var debug_mode = false;

	function appendTransform(defaults, transform) {
		defaults = angular.isArray(defaults) ? defaults : [defaults];
		return defaults.concat(transform);
	}

	function request(httpData, method) {
		httpData.params = httpData.params || {};

		if (debug_mode) {
			httpData.params.debug_mode = 1;
		}

		return (
			$http({
				url                 : httpData.url,
				method              : method,
				params              : method == 'GET' ? httpData.params : {},
				data                : method == 'POST' ? httpData.params : {}/*,
				transformResponse   : appendTransform($http.defaults.transformResponse, function(data) {
					return data.result || data.errors || null;
				})*/
			}).
			success(function(data){
				if (typeof httpData.success == 'function') {
					httpData.success(data);
				}
			}).
			error(function(data){
				if (typeof httpData.error == 'function') {
					httpData.error(data);
				}
			})
		);
	}

	HTTP.get = function(httpData) {
		return request(httpData, 'GET');
	};

	HTTP.post = function(httpData) {
		return request(httpData, 'POST');
	};

	return HTTP;
	
});

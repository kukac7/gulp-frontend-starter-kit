app.factory('errorHandler', function() {

	var ERROR = {};

	ERROR.get = {
		'email:missing': 'Hiányzó email cím!'
	};

	return ERROR;

});

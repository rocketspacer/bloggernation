appServices.factory('testService', [
	function() {
		
		var promiseParam = function(timeout) {
			return (fulfill, reject) => { setTimeout(() => fulfill(), timeout); };
		}; 

		var serviceObj = {
			foo: {message: 'Hello'},
			loadingPromise: function(timeout) { 
				var promise = new Promise(promiseParam(timeout))
								.then(() => { console.log('loading finished after', timeout, 'ms'); });
				return promise;
			},
			testLoading: function() {
				return new Promise((fulfill, reject) => {
					console.log('resolved');
					fulfill();
				});
			}
		};

		return serviceObj;
	}
]);
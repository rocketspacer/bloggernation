appControllers.controller('loginCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'authService',
	function ($rootScope, $scope, $state, $stateParams, authService) {

		//--------------------------------------------------------
		//State status

		// console.log('state:', $state);
		// console.log('stateParams:', $stateParams);

		//--------------------------------------------------------
		//Inputs Variables
		$scope.input = {
			username: '',
			password: ''
		};
		$scope.error = {
			username: false,
			password: false
		};
		$scope.helpText = {
			username: '',
			password: ''
		};

		//--------------------------------------------------------
		//Display Data Variables

		//--------------------------------------------------------
		//Events triggers
		$scope.loginLocal = function () {
			$rootScope.loading = true;
			authService.authLocal($scope.input.username, $scope.input.password, (errors, response) => {
				$rootScope.loading = false;

				if (errors) {
					$scope.error.username = $scope.error.password = false;			
					errors.forEach((e) => {
						if (e.path === 'username') { $scope.error.username = true; $scope.helpText.username = e.message; }
						else if (e.path === 'password') { $scope.error.password = true; $scope.helpText.password = e.message; }
					});

					return $scope.$apply();
				}

				$state.go('auth');
			});
		};

		//--------------------------------------------------------
		//Initialize default data

		//--------------------------------------------------------
		//State Change Command	
	}
]);
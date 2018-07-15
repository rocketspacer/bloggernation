appControllers.controller('signupCtrl', ['$rootScope', '$scope', '$state', 'accountService', 'authService',
	function ($rootScope, $scope, $state, accountService, authService) {

		//--------------------------------------------------------
		//State status

		// console.log('state:', $state);
		// console.log('stateParams:', $stateParams);

		//--------------------------------------------------------
		//Inputs Variables
		$scope.input = {
			username: '',
			password: '',
			email: '',
			firstName: '',
			lastName: '',
			birthday: new Date(),			
			gender: ''
		};

		//--------------------------------------------------------
		//Display Data Variables
		$scope.error = {
			username	: false,
			password	: false,
			email		: false,
			firstName	: false,
			lastName	: false,
			birthday	: false,			
			gender		: false
		};
		$scope.helpText = {
			username	: '',
			password	: '',
			email		: '',
			firstName	: '',
			lastName	: '',
			birthday	: '',			
			gender		: ''
		};

		//--------------------------------------------------------
		//Events triggers
		$scope.register = function () {
			$rootScope.loading = true;
			accountService.register(Object.assign({}, $scope.input), (errors, response) => {
				if (errors) {

					if (Array.isArray(errors)) {
						$scope.error.username = $scope.error.password = $scope.error.email = $scope.error.firstName = $scope.error.lastName = $scope.error.birthday = $scope.error.gender = false;	
						errors.forEach((e) => {
							if (e.path === 'username') 			{ $scope.error.username = true; 	$scope.helpText.username = e.message; }
							else if (e.path === 'password') 	{ $scope.error.password = true; 	$scope.helpText.password = e.message; }
							else if (e.path === 'email') 		{ $scope.error.email = true; 		$scope.helpText.email = e.message; }
							else if (e.path === 'firstName') 	{ $scope.error.firstName = true; 	$scope.helpText.firstName = e.message; }
							else if (e.path === 'lastName') 	{ $scope.error.lastName = true; 	$scope.helpText.lastName = e.message; }
							else if (e.path === 'birthday') 	{ $scope.error.birthday = true; 	$scope.helpText.birthday = e.message; }
							else if (e.path === 'gender') 		{ $scope.error.gender = true; 		$scope.helpText.gender = e.message; }
						});
					}
					
					$rootScope.loading = false;				
					$scope.$apply();				

				} else {

					$rootScope.loading = true;
					$scope.$apply();				
					
					authService.authLocal($scope.input.username, $scope.input.password, (e, response) => {
						if (e) { console.log(e); $state.go('preauth'); } // Doesn't suppose to happen
						else $state.go('auth');
						$scope.$apply();			
					});
				}
			});
		};

		//--------------------------------------------------------
		//Initialize default data

		//--------------------------------------------------------
		//State Change Command	
	}
]);
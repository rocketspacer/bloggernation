appControllers.controller('authNavbarCtrl', ['$scope', '$state', 'accountService', 'authService',
	function($scope, $state, accountService, authService) {

		//--------------------------------------------------------
		//State status
		accountService.getSelf((err, response) => {
			if (err) return console.log(err);

			$scope.account = response.account;
			$scope.$apply();
		});
		//--------------------------------------------------------
		//Inputs Variables

		//--------------------------------------------------------
		//Display Data Variables

		//--------------------------------------------------------
		//Events triggers
		$scope.logout = function() {
			authService.logout();
			$state.go('preauth');
		};

		//--------------------------------------------------------
		//Initialize default data

		//--------------------------------------------------------
		//State Change Command	
	}
]);
appControllers.controller('landingCtrl', ['$scope', '$state', '$stateParams', 'testService',
	function($scope, $state, $stateParams, testService) {

		//--------------------------------------------------------
		//State status

        // console.log('state:', $state);
        // console.log('stateParams:', $stateParams);

		//--------------------------------------------------------
		//Inputs Variables
		
		//--------------------------------------------------------
		//Display Data Variables

		//--------------------------------------------------------
		//Events triggers
        $scope.go = function() {
            console.log('go');
            $state.go('auth.home');
        };

		//--------------------------------------------------------
		//Initialize default data

		//--------------------------------------------------------
		//State Change Command	
	}
]);
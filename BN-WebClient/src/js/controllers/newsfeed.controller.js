appControllers.controller('newsfeedCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'newsfeedService',
	function ($rootScope, $scope, $state, $stateParams, newsfeedService) {

		//--------------------------------------------------------
		//State status

		var reloadNewsFeed = function() {
            newsfeedService.getNewsFeed((err, posts) => {
                if (err || !Array.isArray(posts) || posts.length === 0) return;
                $scope.newsfeed = posts;
                $scope.$apply();
            });
        };

        reloadNewsFeed();
		//--------------------------------------------------------
		//Inputs Variables

		//--------------------------------------------------------
		//Display Data Variables
        $scope.newsfeed = [];
        $scope.postContent = '';

		//--------------------------------------------------------
		//Events triggers
        newsfeedService.iosocket.on('post', (args) => {
            console.log(args.message);
            reloadNewsFeed();
        });

        $scope.createPost = function() {
            newsfeedService.createPost($scope.postContent, (err, response) => {
                if (!err) {
                    $scope.postContent = '';
                    $scope.$apply();
                }
            });
        };
	
		//--------------------------------------------------------
		//Initialize default data

		//--------------------------------------------------------
		//State Change Command	
	}
]);
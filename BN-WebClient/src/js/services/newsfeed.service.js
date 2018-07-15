appServices.factory('newsfeedService', ['authService',
    function (authService) {
        
        var serviceObj = {
            iosocket: io('http://54.255.178.212:1340'),
            createPost: function(message, cb) {
                var promise = new Promise((fulfill, reject) => {
                    $.ajax({
                        url: '/api/newsfeed',
                        method: 'POST',
                        data: { content: message },
                        headers: { access_token: localStorage.getItem('token')},
                        success: fulfill,
                        error: reject
                    });
                });

                promise
                    .then((response) => cb(null, response))
                    .catch((xhr, textStatus, errorThrown) => cb(xhr.responseJSON));
            },
            getNewsFeed: function (cb) {
                var promise = new Promise((fulfill, reject) => {
                    $.ajax({
                        url: '/api/newsfeed',
                        method: 'GET',
                        headers: { access_token: localStorage.getItem('token')},                        
                        success: fulfill,
                        error: reject
                    });
                });

                promise
                    .then((response) => cb(null, response))
                    .catch((xhr, textStatus, errorThrown) => cb(xhr.responseJSON));
            }
        };

        return serviceObj;
    }
]);
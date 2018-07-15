appServices.factory('accountService', ['authService',
    function (authService) {

        var serviceObj = {
            
            // -------
            register: function (params, cb) {

                var promise = new Promise((fulfill, reject) => {
                    $.ajax({
                        url: '/api/accounts',
                        method: 'POST',
                        data: params,
                        success: fulfill,
                        error: reject
                    });
                });

                promise
                    .then((response) => cb(null, response))
                    .catch((xhr, textStatus, errorThrown) => cb(xhr.responseJSON));
            },

            //
            getSelf: function (callback) {

                // if (!authService.isAuthenticated()) return callbacK()

                var promise = new Promise((fulfill, reject) => {
                    $.ajax({
                        url: '/api/accounts/self',
                        method: 'GET',
                        headers: { access_token: localStorage.getItem('token') },
                        success: fulfill,
                        error: reject
                    });
                });

                promise
                    .then((response) => callback(null, response))
                    .catch((xhr, textStatus, errorThrown) => callback({ xhr: xhr, textStatus: textStatus, errorThrown: errorThrown }));
            }

        };

        return serviceObj;
    }
]);
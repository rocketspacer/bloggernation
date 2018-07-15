appServices.factory('authService', [
    function () {

        var serviceObj = {

            isAuthenticated: function () {
                if (localStorage.getItem('token')) return true;
                return false;
            },

            // Local Authentication
            authLocal: function (username, password, cb) {

                var promise = new Promise((fulfill, reject) => {
                    $.ajax({
                        url: '/api/auth/local',
                        method: 'GET',
                        data: { username: username, password: password },
                        success: fulfill,
                        error: reject
                    });
                });

                promise
                    .then((response) => {
                        localStorage.setItem('token', response.access_token);
                        cb(null, response);
                    })
                    .catch((xhr, textStatus, errorThrown) => cb(xhr.responseJSON));
            },

            // Facebook Authentication
            authFacebook: function (code, cb) {
                var promise = new Promise((fulfill, reject) => {
                    $.ajax({
                        url: '/api/auth/facebook/callback',
                        method: 'GET',
                        data: { code: code },
                        success: fulfill,
                        error: reject
                    });
                });

                promise
                    .then((response) => {
                        console.log('response:', response);
                        localStorage.setItem('token', response.access_token);
                        cb(null, response);
                    })
                    .catch((xhr, textStatus, errorThrown) => cb(xhr.responseJSON));
            },

            //
            register: function (params, cb) {

                var promise = new Promise((fulfill, reject) => {
                    $.ajax({
                        url: '/api/auth/register',
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
            logout: function () {
                localStorage.removeItem('token');
            },

            //
            getSelf: function () {
                var promise = new Promise((fulfill, reject) => {
                    $.ajax({
                        url: '/api/profiles/self',
                        method: 'GET',
                        success: fulfill,
                        error: reject
                    });
                });

                promise
                    .then((response) => cb(null, response))
                    .catch((xhr, textStatus, errorThrown) => cb({ xhr: xhr, textStatus: textStatus, errorThrown: errorThrown }));
            }

        };

        return serviceObj;
    }
]);
var path = require('path');
//------------------------------------------------------------------------
var request = require('request');

//------------------------------------------------------------------------
var registry = Utils.getConfig('registry');

//------------------------------------------------------------------------
var serviceName = 'bn-profile';
var serviceKey = 'default-api-key';

//------------------------------------------------------------------------
module.exports = {
    name: serviceName,
    apiKey: serviceKey,
    createProfile: function(params, done) {
        registry.resolveService(serviceName, (err, service) => {
            if (err) return done(err);
            request({
                url: 'http://' + service.IP + ':' + service.PORT + '/api/profiles',
                method: 'POST',
                body: params,
                json: true,
                headers: { api_key: serviceKey }
            },
            (err, response, body) => {
                if (err) return done(err);
                done(null, response);
            });
        });
    },
    // updateProfile: function(username, profileParams, done) {
    //     registry.resolveService(serviceName, (err, service) => {
    //         if (err) return done(err);
    //         request({
    //             url: 'http://' + service.IP + ':' + service.PORT + '/api/profiles' + username,
    //             method: 'PUT',
    //             headers: { api_key: serviceKey }
    //         },
    //         (err, response, body) => {
    //             if (err) return done(err);
    //             done(null, response);
    //         });
    //     });
    // }
};
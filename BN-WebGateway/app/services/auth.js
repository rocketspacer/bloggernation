var path = require('path');

//------------------------------------------------------------------------
var request = require('request');
var registry = Utils.getConfig('registry');
var proxy = Utils.getConfig('proxy');

//------------------------------------------------------------------------

//------------------------------------------------------------------------
var serviceName = 'bn-auth';
var serviceKey = 'default-api-key';

//------------------------------------------------------------------------
module.exports = {
    name: serviceName,
    apiKey: serviceKey,

    // End points
    resolveToken: function(access_token, done) {
        registry.resolveService(serviceName, (err, service) => {
            if (err) return done(err);
            request({
                url: 'http://' + service.IP + ':' + service.PORT + '/api/auth/resolvetoken',
                method: 'GET',
                headers: {
                    api_key: serviceKey, 
                    access_token: access_token 
                }
            },
            (err, response, body) => {
                if (err) return done(err);
                done(null, response);
            });
        });
    },

    proxy: () => proxy.toService(serviceName, {api_key: serviceKey})
};
//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var proxy = require('express-http-proxy');

//------------------------------------------------------------------------
// Configurations
var registry = Utils.getConfig('registry');

//------------------------------------------------------------------------
// Config Object
var configObject = {
    toService: function(serviceName, headers) {
        return function(req, res, next) {
            registry.resolveService(serviceName, (err, service) => {
                if (err) return res.status(503).json({message: serviceName + ' unavailable'});
                proxy(service.IP + ':' + service.PORT, {
                    forwardPath: (req, res) => req.originalUrl,
                    decorateRequest: (proxyReq, originalReq) => {
                        Object.assign(proxyReq.headers, headers);
                        proxyReq.headers['Content-Type'] = 'application/json';
                        proxyReq.bodyContent = JSON.stringify(originalReq.body);
                        return proxyReq;
                    },
                })(req, res, next);
            });
        };
    }
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;
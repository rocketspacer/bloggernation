//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies

//------------------------------------------------------------------------
// Configurations
var authService = Utils.getService('auth');

//------------------------------------------------------------------------
// Config Object
var configObject = {
    checkApiKey: function (req, res, next) {

        if (req.headers.api_key !== Configs.API_KEY && req.query.api_key !== Configs.API_KEY && req.body.api_key !== Configs.API_KEY)
            return res.status(401).json([{ path: 'api_key', message: 'Invalid API Key'}]);
        next();
    },
    resolveToken: function(req, res, next) {
        
        if (!req.headers.access_token) return res.status(401).json([{ path: 'access_token', message: 'Missing access_token'}]);
        authService.resolveToken(req.headers.access_token, (err, response) => {
            if (err) return res.status(503).json([{message: authService.name + ' unavailable'}]);
            if (response.statusCode === 200) {
                var principle = JSON.parse(response.body).principle;
                req.principle = principle;
                req.headers.authorization = Buffer.from(JSON.stringify(principle)).toString('base64');
                return next();
            }
            
            // All else
            res.status(response.statusCode).json(response.body);
        });
    }
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;
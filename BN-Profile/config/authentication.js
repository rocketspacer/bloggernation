//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies

//------------------------------------------------------------------------
// Config Object
var configObject = {
    checkApiKey: function (req, res, next) {
        if (req.headers.api_key !== Configs.API_KEY && req.query.api_key !== Configs.API_KEY && req.body.api_key !== Configs.API_KEY)
            return res.status(401).json([{ path: 'api_key', message: 'Invalid API Key'}]);
        next();
    },
    extractAuthInfo: function(req, res, next) {

        if (!req.headers.authorization) return res.status(401).json([{ path: 'authorization', message: 'Missing authorization principle'}]);

        try {
            var principle = JSON.parse(Buffer.from(req.headers.authorization, 'base64').toString());
            req.principle = principle;
            next();
        }
        catch(e) {
            res.status(400).json([{ path: 'authorization', message: 'Malformatted authorization principle'}]);
        }
    }
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;
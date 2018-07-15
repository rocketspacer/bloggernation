//------------------------------------------------------------------------
// API Router
var express     = require('express');
var apiRouter   = express.Router();

//------------------------------------------------------------------------
// API versions
var v1Api = require('./api/v1/apiRouter');

//------------------------------------------------------------------------
// Mount APIs on router with version path
apiRouter.use('/v1', v1Api);

//------------------------------------------------------------------------
// Mount latest version API
apiRouter.use('/', v1Api);

//------------------------------------------------------------------------
// Exports
module.exports = apiRouter;
//------------------------------------------------------------------------
// API Router
var express     = require('express');
var apiRouter   = express.Router();

//------------------------------------------------------------------------
// API endpoints
var profilesRouter    = require('./endpoints/profiles');

//------------------------------------------------------------------------
// Mount API endpoints on router
apiRouter.use('/profiles', profilesRouter);

//------------------------------------------------------------------------
// Exports
module.exports = apiRouter;
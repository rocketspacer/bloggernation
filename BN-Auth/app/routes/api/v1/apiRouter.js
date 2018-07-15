//------------------------------------------------------------------------
// API Router
var express     = require('express');
var apiRouter   = express.Router();

//------------------------------------------------------------------------
// API endpoints
var authRouter      = require('./endpoints/auth');
var accountsRouter  = require('./endpoints/accounts');

//------------------------------------------------------------------------
// Mount API endpoints on router
apiRouter.use('/auth', authRouter);
apiRouter.use('/accounts', accountsRouter);

//------------------------------------------------------------------------
// Exports
module.exports = apiRouter;
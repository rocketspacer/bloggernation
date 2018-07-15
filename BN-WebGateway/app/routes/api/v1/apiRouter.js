//------------------------------------------------------------------------
// API Router
var express     = require('express');
var apiRouter   = express.Router();

//------------------------------------------------------------------------
// Configurations
var auth = Utils.getConfig('authentication');
var proxy = Utils.getConfig('proxy');

//------------------------------------------------------------------------
// API endpoints
var authRouter    = require('./endpoints/auth');
var accountsRouter = require('./endpoints/accounts');
var newsfeedRouter = require('./endpoints/newsfeed');
var profilesRouter = require('./endpoints/profiles');

//------------------------------------------------------------------------
// Mount API endpoints on router
apiRouter.use('/auth', authRouter);
apiRouter.use('/accounts', accountsRouter);
apiRouter.use('/newsfeed', newsfeedRouter);
apiRouter.use('/profiles', profilesRouter);

//------------------------------------------------------------------------
// Exports
module.exports = apiRouter;
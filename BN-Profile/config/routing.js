//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');

//------------------------------------------------------------------------
// Configurations
var auth = Utils.getConfig('authentication');

//------------------------------------------------------------------------
// Endpoint Routers
var navRouter = Utils.getRouter('nav');
var apiRouter = Utils.getRouter('api');

//------------------------------------------------------------------------
// Mount to Application Router
var appRouter = express.Router();
appRouter.use('/', navRouter);
appRouter.use('/api',
    auth.checkApiKey,
    apiRouter);

//------------------------------------------------------------------------
// Config Object
var configObject = {
	appRouter: appRouter
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;
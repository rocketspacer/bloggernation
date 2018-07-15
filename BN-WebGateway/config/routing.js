//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');

//------------------------------------------------------------------------
// Endpoint Routers
var apiRouter = Utils.getRouter('api');
var navRouter = Utils.getRouter('nav');

//------------------------------------------------------------------------
// Mount to Application Router
var appRouter = express.Router();
appRouter.use('/api', apiRouter);
appRouter.use('/', navRouter);

//------------------------------------------------------------------------
// Config Object
var configObject = {
	appRouter: appRouter
};

//------------------------------------------------------------------------
// Exports
module.exports =  configObject;
//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');

//------------------------------------------------------------------------
// Auth Router 
var authRouter = express.Router();

//------------------------------------------------------------------------
// Models

//------------------------------------------------------------------------
// Configurations
var authService = Utils.getService('auth');
var auth    = Utils.getConfig('authentication');

//------------------------------------------------------------------------
// Local Auth
authRouter.get('/local', authService.proxy());

//------------------------------------------------------------------------
// Facebook Auth
authRouter.get('/facebook', authService.proxy());
authRouter.get('/facebook/callback', authService.proxy());

//------------------------------------------------------------------------
// Jwt Auth
authRouter.get('/resolvetoken', authService.proxy());

//------------------------------------------------------------------------
// Exports
module.exports = authRouter;
//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');

//------------------------------------------------------------------------
// Profiles Router 
var accountsRouter = express.Router();

//------------------------------------------------------------------------
// Models

//------------------------------------------------------------------------
// Configurations
var authService = Utils.getService('auth');
var auth    = Utils.getConfig('authentication');

//------------------------------------------------------------------------
// Local account
accountsRouter.post('/', authService.proxy());
accountsRouter.get('/self', auth.resolveToken, authService.proxy());
accountsRouter.get('/:username', authService.proxy());

//------------------------------------------------------------------------
// Exports
module.exports = accountsRouter;
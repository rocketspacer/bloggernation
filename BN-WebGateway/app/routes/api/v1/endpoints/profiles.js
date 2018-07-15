//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');

//------------------------------------------------------------------------
// Profiles Router 
var profilesRouter = express.Router();

//------------------------------------------------------------------------
// Models

//------------------------------------------------------------------------
// Configurations
var profileService = Utils.getService('profile');
var auth    = Utils.getConfig('authentication');

//------------------------------------------------------------------------
// Local profiles
profilesRouter.get('/:username', profileService.proxy());


//------------------------------------------------------------------------
// Exports
module.exports = profilesRouter;
//------------------------------------------------------------------------
// Navigation Router
var express = require('express');
var navRouter = express.Router();

//------------------------------------------------------------------------
// Configurations
var auth = Utils.getConfig('authentication');

//------------------------------------------------------------------------
// Navigation Routes
navRouter.get('/',      (req, res) => res.status(200).end('BN-Gateway is online'));
navRouter.get('/ping',  (req, res) => res.status(200).end('BN-Gateway is online'));

//------------------------------------------------------------------------
// Exports
module.exports = navRouter;
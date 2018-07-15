//------------------------------------------------------------------------
// Navigation Router
var express     = require('express');
var navRouter   = express.Router();

//------------------------------------------------------------------------
// Navigation Routes
navRouter.get('/',      (req, res) => res.status(200).end('BN-Auth is online'));
navRouter.get('/ping',  (req, res) => res.status(200).end('BN-Auth is online'));

//------------------------------------------------------------------------
// Exports
module.exports = navRouter;
//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');
var Joi     = require('joi');
var lodash  = require('lodash');

//------------------------------------------------------------------------
// Account Router 
var accountsRouter = express.Router();

//------------------------------------------------------------------------
// Models
var Account = Utils.getModel('Account');

//------------------------------------------------------------------------
// Configurations
var auth                = Utils.getConfig('authentication');
var accountValidator    = Utils.getValidator('account');
var helper              = Utils.getValidator('helper');
var profileService      = Utils.getService('profile');

//------------------------------------------------------------------------
// Register
accountsRouter.post('/', (req, res, next) => {
    var validationError = Joi.validate(req.body, accountValidator.registerSchema, { abortEarly: false, allowUnknown: true}).error;
    if (validationError)
        return res.status(400).json(helper.formatError(validationError));

    //=====================
    var acc = new Account({
        username: req.body.username,
        email: req.body.email,
        passwordHash: Account.generateHash(req.body.password)
    });

    //=====================
    acc.save((err) => {
        if (err) {
            if (err.code === 11000) {
                var dupKey = helper.extractDupIndex(err.errmsg);
                return res.status(400).json([{ path: dupKey, message: lodash.upperFirst(dupKey + ' already use in another account') }]);
            }
            else return next(err);
        }
        
        profileService.createProfile(req.body, (err, response) => {
            if (err || response.statusCode !== 200) 
                acc.remove(); // This fails and our database corrupt
            
            if (err) {
                if (err.code === 'ENOTFOUND') return res.status(503).json({message: profileService.name + ' unavailable'});
                else return next(err);
            }

            if (response.statusCode !== 200) return res.status(response.statusCode).json(response.body); // Pipe downstream response
            res.status(200).json({message: 'Account and Profile created'});
        });
    });
});

accountsRouter.get('/self', auth.extractAuthInfo, (req, res, next) => {
    var principle = req.principle;
    Account.findOne({username: principle.username})
        .exec((err, acc) => {
            if (err) return next(err);
            if (!acc) return res.status(404).json([{message: 'Can\'t find any account with associated username'}]);

            var jacc = acc.toObject();
            delete jacc.passwordHash;
            res.status(200).json({ account: jacc });
        });
});

//------------------------------------------------------------------------
// Exports
module.exports = accountsRouter;
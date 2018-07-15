//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var jwt = require('jsonwebtoken');
var passport = require('passport');
var express = require('express');
var Joi = require('joi');
var lodash = require('lodash');

//------------------------------------------------------------------------
// Auth Router 
var authRouter = express.Router();

//------------------------------------------------------------------------
// Models
var Account = Utils.getModel('Account');

//------------------------------------------------------------------------
// Configurations
var auth = Utils.getConfig('authentication');
var accountValidator = Utils.getValidator('account');
var helper = Utils.getValidator('helper');
var profileService = Utils.getService('profile');

//------------------------------------------------------------------------
// Local Auth
authRouter.get('/local', (req, res, next) => {
    passport.authenticate('local', (err, account, info) => {
        if (err) return next(err);
        if (!account) return res.status(401).json(info);

        var access_token = jwt.sign({ accountId: account._id }, Configs.JWT_KEY, { algorithm: Configs.JWT_SIGN_ALGORITHM });
        res.status(200).json({ access_token: access_token });

    })(req, res, next);
});

//------------------------------------------------------------------------
// Register
authRouter.post('/register', (req, res, next) => {
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

            res.status(200).json({ message: 'Account and Profile created' });
        });
    });
});

//------------------------------------------------------------------------
// Facebook Auth
authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'user_about_me', 'user_birthday'] }));

authRouter.get('/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, account, info) => {
        if (err) return next(err);
        if (!account) return res.status(401).json(info);

        var access_token = jwt.sign({ accountId: account._id }, Configs.JWT_KEY, { algorithm: Configs.JWT_SIGN_ALGORITHM });
        res.status(200).json({ access_token: access_token });
    })(req, res, next);
});

//------------------------------------------------------------------------
// Jwt Auth
authRouter.get('/resolvetoken', (req, res, next) => {
    passport.authenticate('jwt', (err, account, info) => {
        if (err) return next(err);
        if (!account) {
            if (info instanceof Error) return res.status(400).json([{ path: 'access_token', message: info.message }]);
            return res.status(401).json(info);
        }

        var acc = account.toObject();
        delete acc.passwordHash;
        res.status(200).json({ principle: acc });
    })(req, res, next);
});

//------------------------------------------------------------------------
// Exports
module.exports = authRouter;
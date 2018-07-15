//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var passport    = require('passport');
var Joi         = require('joi');
var jwt         = require('jsonwebtoken');
var shortid     = require('shortid');

//------------------------------------------------------------------------
// Configurations
var accountValidator    = Utils.getValidator('account');
var helper              = Utils.getValidator('helper');
var Account             = Utils.getModel('Account');
var profileService      = Utils.getService('profile');

//------------------------------------------------------------------------
// Local Authentication
var LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: false,
        passReqToCallback: true
    },
    function(req, username, password, done) {

        var validationError = Joi.validate({username: username, password: password}, accountValidator.loginSchema, { abortEarly: false, allowUnknown: true}).error;
        if (validationError)
            return done(null, false, helper.formatError(validationError));
    
        Account
            .findOne({ $or: [{ username: username }, { email: username }] })
            .exec((err, account) => {
                if (err) return done(err);
                if (!account) return done(null, false, [{ path: 'username', message: 'Username or Email doesn\'t exist'}]);
                if (!account.passwordHash) return done(null, false, [{ path: 'password', message: 'This account doesn\'t use password authentication'}]);
                if (!account.validPassword(password)) return done(null, false, [{ path: 'password', message: 'Incorrect password'}]);
                done(null, account);
            });
    })
);

//------------------------------------------------------------------------
// Facebook Authentication
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use('facebook', new FacebookStrategy({
        clientID        : Configs.FACEBOOK_APP_ID,
        clientSecret    : Configs.FACEBOOK_APP_SECRET,
        callbackURL     : Configs.FACEBOOK_CALLBACK,
        enableProof     : true,
        profileFields   : ['id', 'displayName', 'name', 'gender', 'emails', 'birthday'],
        session: false
    },
    function(accessToken, refreshToken, profile, done) {
        
        Account
            .findOne({facebookId: profile.id})
            .exec((err, account) => {
                if (err) return done(err);                
                if (account) return done(null, account);

                // No account by that facebookId exists begin creating new account
                profile = profile._json;
                var accountParams = {
                    username    : 'user' + profile.id,
                    email       : profile.email,
                    facebookId  : profile.id
                };
                var profileParams = {
                    username: accountParams.username,
                    firstName : profile.first_name || 'facebook',
                    lastName : profile.last_name || 'user' + profile.id,
                    gender: profile.gender,
                    birthday: profile.birthday
                };

                // var validationError = Joi.validate(accountParams, accountValidator.accountSchema, { abortEarly: false, allowUnknown: true}).error;
                //if (validationError) return done(helper.formatError(validationError)); // Server create malformatted params should emit error and response 500
                
                //=====================
                var acc = new Account(accountParams);
                acc.save((err) => {
                    if (err) return done(err);

                    profileService.createProfile(profileParams, (err, response) => {
                        if (err || response.statusCode !== 200) 
                            acc.remove(); // This fails and our database corrupt
                        
                        if (err) {
                            if (err.code === 'ENOTFOUND') return done({message: profileService.name + ' unavailable'});
                            else return done(err);
                        }

                        if (response.statusCode !== 200) return done(response.body); // Pipe downstream response
                        done(null, acc);
                    });
                });
            });
    }
));

//------------------------------------------------------------------------
// JWT Authentication
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('access_token'),
        secretOrKey: Configs.JWT_KEY,
        algorithms: Configs.JWT_AUTH_ALGORITHMS,
        session: false
    },
    function(jwt_payload, done) {
        Account
            .findById(jwt_payload.accountId)
            .exec((err, account) => {
                if (err) return done(err);
                if (!account) return done(null, false, [{ path: 'access_token', message: 'Account doesn\'t exists' }]);
                done(null, account);
            });
    })
);

//------------------------------------------------------------------------
// Exports
module.exports = {
    checkApiKey: function(req, res, next) {
        if (req.headers.api_key !== Configs.API_KEY && req.query.api_key !== Configs.API_KEY && req.body.api_key !== Configs.API_KEY)
            return res.status(401).json([{ path: 'api_key', message: 'Invalid API Key'}]);
        next();
    },
    extractAuthInfo: function(req, res, next) {

        if (!req.headers.authorization) return res.status(401).json({message: 'Missing authorization principle'});

        try {
            var principle = JSON.parse(Buffer.from(req.headers.authorization, 'base64').toString());
            req.principle = principle;
            next();
        }
        catch(e) {
            res.status(400).json([{ path: 'authorization', message: 'Malformatted authorization principle'}]);
        }
    }
};
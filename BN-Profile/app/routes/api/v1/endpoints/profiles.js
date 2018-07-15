//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');
var Joi = require('joi');

//------------------------------------------------------------------------
// Profile Router 
var authRouter = express.Router();

//------------------------------------------------------------------------
// Models
var Profile = Utils.getModel('Profile');

//------------------------------------------------------------------------
// Configurations
var auth                = Utils.getConfig('authentication');
var profileValidator = Utils.getValidator('profile');
var helper = Utils.getValidator('helper');

//------------------------------------------------------------------------
// Create Profile
authRouter.post('/', (req, res, next) => {
    
    var validationError = Joi.validate(req.body, profileValidator.profileSchema, {abortEarly: false, allowUnknown: true}).error;
    if (validationError)
        return res.status(400).json(helper.formatError(validationError));

    //=====================
    var profile = new Profile({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday,
        gender: req.body.gender
    });

    //=====================    
    profile.save((err) => {
        if (err) return next(err);
        res.status(200).json({message: 'Profile created'});
    });
});

//------------------------------------------------------------------------


//------------------------------------------------------------------------
// Exports
module.exports = authRouter;
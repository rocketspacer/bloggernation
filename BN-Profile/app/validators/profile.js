//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var Joi = require('joi');

//------------------------------------------------------------------------
// Validation Schemas
var validationSchemas = {
    usernameSchema      : Joi.string().trim().min(3).max(28).alphanum().required(),
    firstNameSchema     : Joi.string().trim().max(256).regex(/^[a-zA-Z]+$/, 'alpha').required(),
    lastNameSchema      : Joi.string().trim().max(256).regex(/^[a-zA-Z]+$/, 'alpha').required(),
    genderSchema        : Joi.string().valid(['male', 'female', 'other']).required(),
    birthdaySchema      : Joi.date().required(),

    aboutSchema         : Joi.string(),
    profileImageSchema  : Joi.string().uri({allowRelative: true}),
    coverImageSchema    : Joi.string().uri({allowRelative: true}),
};

//------------------------------------------------------------------------
// Exports
module.exports = {
    profileSchema: {
        username        : validationSchemas.usernameSchema,
        firstName       : validationSchemas.firstNameSchema,
        lastName        : validationSchemas.lastNameSchema,
        gender          : validationSchemas.genderSchema,
        birthday        : validationSchemas.birthdaySchema,
        about           : validationSchemas.aboutSchema,
        profileImage    : validationSchemas.profileImageSchema,
        coverImage      : validationSchemas.coverImageSchema
    }
};
Object.assign(module.exports, validationSchemas);
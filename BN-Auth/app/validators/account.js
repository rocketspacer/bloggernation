//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var Joi = require('joi');

//------------------------------------------------------------------------
// Validation Schemas
var validationSchemas = {
    usernameSchema  : Joi.string().trim().min(3).max(28).alphanum().invalid('self').required(),
    emailSchema     : Joi.string().trim().email().required(),
    passwordSchema  : Joi.string().min(6).max(36),
};

//------------------------------------------------------------------------
// Exports
module.exports = {

    loginSchema: {
        username    : [validationSchemas.usernameSchema, validationSchemas.emailSchema],
        password    : validationSchemas.passwordSchema
    },
    registerSchema: {
        username    : validationSchemas.usernameSchema,
        email       : validationSchemas.emailSchema,
        password    : validationSchemas.passwordSchema.required()
    },
    accountSchema: {
        username    : validationSchemas.usernameSchema,
        email       : validationSchemas.emailSchema,
        password    : validationSchemas.passwordSchema
    }
};
Object.assign(module.exports, validationSchemas);
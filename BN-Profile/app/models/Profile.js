//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var mongoose = require('mongoose');

//------------------------------------------------------------------------
// Reference Schema

//------------------------------------------------------------------------
// Validator
// var validator = Utils.getValidator('booking');

//------------------------------------------------------------------------
// Schema definition
var profileSchema = mongoose.Schema({

    // Reference
    username        : { type: String, required: true, trim: true, unique: true, index: true },

    // Basics
    firstName       : { type: String, trim: true, required: true },
    lastName        : { type: String, trim: true, required: true },
    gender          : { type: String, trim: true, required: true, enum: ['male', 'female', 'other']},
    birthday        : { type: Date, required: true },

    // Extra
    about           : { type: String },
    profileImage    : { type: String, trim: true, default: 'bn-media.nmtuan.me/defaults/profile-image.png' }, // Profile Image URL
    coverImage      : { type: String, trim: true, default: 'bn-media.nmtuan.me/defaults/cover-image.png' }, // Cover Image URL
});

//------------------------------------------------------------------------ 
// Static Methods
// profileSchema.statics.foo = function(param) {
//     return 'foo';
// };

//------------------------------------------------------------------------ 
// Instance Methods
// profileSchema.methods.bar = function(param) {
//     return 'bar';
// };

//------------------------------------------------------------------------
// Exports
module.exports = mongoose.model('Profile', profileSchema);
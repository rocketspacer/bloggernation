var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//------------------------------------------------------------------------
// Reference Schema

//------------------------------------------------------------------------
// Validator
// var validator = Utils.getValidator('booking');

//------------------------------------------------------------------------
// Schema definition
var accountSchema = mongoose.Schema({

    username        : { type: String, required: true, trim: true, unique: true, index: true },
    email           : { type: String, required: true, trim: true, unique: true, index: true },
    passwordHash    : { type: String },
    facebookId      : { type: String, trim: true, unique: true, index: true, sparse: true }
});

//------------------------------------------------------------------------
// Schema Methods 
// generating a hash
accountSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function(password) {
    if (!this.passwordHash) return false;
    return bcrypt.compareSync(password, this.passwordHash);
};

//------------------------------------------------------------------------
// Exports
module.exports = mongoose.model('Account', accountSchema);
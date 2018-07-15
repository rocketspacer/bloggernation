//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //Use native ES6 Promise instead of Mongoose's default

//------------------------------------------------------------------------
// Mongo Configurations
var mongoCfg = {
    config: { autoIndex: (Configs.ENV === 'DEVELOPMENT')? true : false }
};

//------------------------------------------------------------------------
// Config Object
var configObject = {

    // Connect to database
    connect: function (done) {
		
        mongoose.connect(Configs.DATABASE_URL, mongoCfg, function(err) {

            if (err) {
            	console.error('Can\'t connect to MongoDB at', Configs.DATABASE_URL);
            	return done(err);
            }

            console.log('MongoDB connected at', Configs.DATABASE_URL);
            done();
        });
    }
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;
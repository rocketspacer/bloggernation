//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies

//------------------------------------------------------------------------
// Config Object
var configObject = {
	
	handler: function (err, req, res, next) {
		console.log(err);
		res.status(500).json({
	        message: 'Unhandled error',
	        error: err
	    });
	}
};

//------------------------------------------------------------------------
// Exports
module.exports =  configObject;
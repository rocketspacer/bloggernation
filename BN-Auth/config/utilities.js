//------------------------------------------------------------------------
// Node Dependencies
var path = require('path');

//------------------------------------------------------------------------
// External Dependencies
var lodash = require('lodash');

//------------------------------------------------------------------------
// Config Object
var configObject = {

    root_path: path.join(__dirname, '..'),

    app_path: function (subpath) {
        return path.join(this.root_path, 'app', subpath);
    },

    getConfig: function (configName) {
        return require(
            path.join(this.root_path, 'config', configName)
        );
    },

    getModel: function (modelName) { //require the model in 'app/models'
        return require(
            this.app_path(
                path.join('models', modelName)
            ));
    },

    getRouter: function (routeName) {
        return require(
            this.app_path(
                path.join('routes', routeName)
            ));
    },

    getService: function (serviceName) {
        return require(
            this.app_path(
                path.join('services', serviceName)
            ));
    },

    getValidator: function (validatorName) {
        return require(
            this.app_path(
                path.join('validators', validatorName)
            ));
    },
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;
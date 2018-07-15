//------------------------------------------------------------------------
// Node Dependencies
var fs = require('fs');
var path = require('path');

//------------------------------------------------------------------------
// External Dependencies
var lodash  = require('lodash');
var shortid = require('shortid');

//------------------------------------------------------------------------
// Loader
var loader = function () {

    //------------------------------------------------------------------------
    // Default configuration
    var dConfigs = {
        // Basics
        SERVICE_ID          : 'bn-auth-' + shortid.generate(),
        SERVICE_NAME        : 'BN-Auth',
        SERVICE_TAGS        : 'AUTH',
        ENV                 : 'DEVELOPMENT',
        PORT                : 1337,
        DATABASE_URL        : 'mongodb://localhost/BN-AuthDB',

        // MONITOR
        PING_PATH           : '/',
        PING_INTERVAL       : '10s',
        PING_TIMEOUT        : '4s',
        REGISTRY_TIMEOUT    : '30m', // Automatically remove service from registry if health is critical

        // Internal Auth
        API_KEY             : 'default-api-key',

        // Jwt Auth
        JWT_KEY             : 'default-jwt-key',
        JWT_SIGN_ALGORITHM  : 'HS256',
        JWT_AUTH_ALGORITHMS : 'HS256, HS384',

        // Facebook OAuth
        FACEBOOK_APP_ID     : '147164932434820',
        FACEBOOK_APP_SECRET : '32c154f0aff83fc039cb44fdd4aab8dd',
        FACEBOOK_CALLBACK   : 'http://127.0.0.1:1337/api/auth/facebook/callback'

        // Google Auth
    }; 
    
    //------------------------------------------------------------------------
    // Load configuration files: env.*  
    var fConfigs = {};

    var configDir = path.join(__dirname, '..', 'env.d');
    if (fs.existsSync(configDir) && fs.statSync(configDir).isDirectory()) {
        var files = fs.readdirSync(configDir).map((f) => {
            var fpath = path.join(configDir, f);
            delete require.cache[require.resolve(fpath)];
            return require(fpath);
        });
        Object.assign(fConfigs, ...files);
    }

    var configFile = path.join(__dirname, '..', 'env.json');
    if (fs.existsSync(configFile)) {
        delete require.cache[require.resolve(configFile)];
        Object.assign(fConfigs, require(configFile));
    }

    //------------------------------------------------------------------------
    // Process ENV configuration
    var eConfigs = {
        // Basics
        SERVICE_ID          : process.env.SERVICE_ID,
        SERVICE_NAME        : process.env.SERVICE_NAME,
        SERVICE_TAGS        : process.env.SERVICE_TAGS,
        ENV                 : process.env.ENV,
        PORT                : process.env.PORT,
        DATABASE_URL        : process.env.DATABASE_URL,

        // MONITOR
        PING_PATH           : process.env.PING_PATH,
        PING_INTERVAL       : process.env.PING_INTERVAL,
        PING_TIMEOUT        : process.env.PING_TIMEOUT,
        REGISTRY_TIMEOUT    : process.env.REGISTRY_TIMEOUT,

        // Internal Auth
        API_KEY             : process.env.API_KEY,

        // Jwt Auth
        JWT_KEY             : process.env.JWT_KEY,
        JWT_SIGN_ALGORITHM  : process.env.JWT_SIGN_ALGORITHM,
        JWT_AUTH_ALGORITHMS : process.env.JWT_AUTH_ALGORITHMS,

        // Facebook OAuth
        FACEBOOK_APP_ID     : process.env.FACEBOOK_APP_ID,    
        FACEBOOK_APP_SECRET : process.env.FACEBOOK_APP_SECRET,
        FACEBOOK_CALLBACK   : process.env.FACEBOOK_CALLBACK

        // Google Auth
    };

    //Remove empty configuration
    for (var cnfKey in eConfigs) {
        if (eConfigs[cnfKey] === undefined)
            delete eConfigs[cnfKey];
    }

    //------------------------------------------------------------------------
    // Config Vars
    var configs = {};        
    Object.assign(configs, dConfigs, fConfigs, eConfigs); //process.env config > file config > default config

    //------------------------------------------------------------------------
    // Normalizing configuration if necessary    
    if (!Number.isInteger(configs.PORT)) {
        configs.PORT = Number.parseInt(configs.PORT, 10);
        if (Number.isNaN(configs.PORT))
            throw new Error('configs: PORT is not an integer');
    }

    if (!Array.isArray(configs.SERVICE_TAGS))
        configs.SERVICE_TAGS = lodash.uniq(configs.SERVICE_TAGS.split(/ *, */));
    
    if (!Array.isArray(configs.JWT_AUTH_ALGORITHMS))
        configs.JWT_AUTH_ALGORITHMS = lodash.uniq(configs.JWT_AUTH_ALGORITHMS.split(/ *, */));

    //------------------------------------------------------------------------
    return configs;
};

//------------------------------------------------------------------------
// Config Object
var configObject = {
    reload: function () {
        var configs = loader();
        Object.assign(this, configs);
    }
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;

//------------------------------------------------------------------------
// Initial trigger
configObject.reload();
//------------------------------------------------------------------------
// Node Dependencies
var fs = require('fs');
var path = require('path');

//------------------------------------------------------------------------
// External Dependencies
var lodash = require('lodash');
var shortid = require('shortid');

//------------------------------------------------------------------------
// Loader
var loader = function () {

    //------------------------------------------------------------------------
    // Default configuration
    var dConfigs = {
        // Basics
        SERVICE_ID: 'bn-gateway-' + shortid.generate(),
        SERVICE_NAME: 'BN-Gateway',
        SERVICE_TAGS: 'GATEWAY',
        ENV: 'DEVELOPMENT',
        PORT: 1338,
        DATABASE_URL: 'mongodb://localhost/BN-GatewayDB',

        // MONITOR
        PING_PATH: '/',
        PING_INTERVAL: '10s',
        PING_TIMEOUT: '4s',
        REGISTRY_TIMEOUT: '30m', // Automatically remove service from registry if health is critical

        // Internal Auth
        API_KEY: 'default-api-key'
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
        SERVICE_ID: process.env.SERVICE_ID,
        SERVICE_NAME: process.env.SERVICE_NAME,
        SERVICE_TAGS: process.env.SERVICE_TAGS,
        ENV: process.env.ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,

        // MONITOR
        PING_PATH: process.env.PING_PATH,
        PING_INTERVAL: process.env.PING_INTERVAL,
        PING_TIMEOUT: process.env.PING_TIMEOUT,
        REGISTRY_TIMEOUT: process.env.REGISTRY_TIMEOUT,

        // Internal Auth
        API_KEY: process.env.API_KEY
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
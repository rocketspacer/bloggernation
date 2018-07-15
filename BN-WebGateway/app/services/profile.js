var path = require('path');

//------------------------------------------------------------------------
var request = require('request');
var registry = Utils.getConfig('registry');
var proxy = Utils.getConfig('proxy');

//------------------------------------------------------------------------

//------------------------------------------------------------------------
var serviceName = 'bn-profile';
var serviceKey = 'default-api-key';

//------------------------------------------------------------------------
module.exports = {
    name: serviceName,
    apiKey: serviceKey,
    proxy: () => proxy.toService(serviceName, {api_key: serviceKey})
};
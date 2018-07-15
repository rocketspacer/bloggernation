//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var lodash = require('lodash');

module.exports = {
    formatError: function(error) {
        
        var details = error.details;
        return lodash.uniqBy(details.map((e) => { return { path: e.path, message: e.message.replace(/\"(.+?)\"/g, (match) => lodash.upperFirst(lodash.trim(match, '"')))}; }), 'path');     
    },
    extractDupIndex: function(errmsg) {
        var words = lodash.words(errmsg);
        return words[words.indexOf('index') + 1];
    }
};
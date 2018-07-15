var service = require('./config/application');
service.start();

//------------------------------------------------------------------------
// OVerrides Ctrl + C
process.on('SIGINT', () => {
    service.stop(() => process.exit(0));
});
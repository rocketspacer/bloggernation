//------------------------------------------------------------------------
// Node Dependencies
var path = require('path');
var http = require('http');

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var cors = require('cors');

//------------------------------------------------------------------------
// Configurations
global.Utils = require('./utilities');
global.Configs = Utils.getConfig('env');
global.App = {
    expressApp: express(),
    authentication: Utils.getConfig('authentication'),    
    database: Utils.getConfig('database'),
    errorHandling: Utils.getConfig('errorHandling'),
    registry: Utils.getConfig('registry'),        
    routing: Utils.getConfig('routing')
};

//------------------------------------------------------------------------
//Express Middlewares Stack
var app = App.expressApp;
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(App.routing.appRouter);
app.use(App.errorHandling.handler);

//------------------------------------------------------------------------
// Config Object
var configObject = {
    // server
    httpServer: http.createServer(App.expressApp),
    // server.start
    start: function () {
        App.database.connect((err) => {
            if (err) return;
            this.httpServer
                .listen(Configs.PORT)
                .on('error', (e) => console.log('Error starting server:', e))
                .on('listening', () => {
                    console.log('Server is listening on', Configs.PORT);
                    App.registry.register((err, serviceId) => {
                        if (err) return console.log('Error registering service:', err);
                        console.log('Service registered:', serviceId);
                    });
                });
        });
    },
    // server.stop    
    stop: function (done) {
        this.httpServer.close((err) => {
            if (err) {
                console.log('Error shutting down server:', err);
                return done();
            }

            console.log('Server is shutting down');
            App.registry.deregister((err, serviceId) => {
                if (err) {
                    console.log('Error deregistering service:', err);
                    return done();
                }

                console.log('Service deregistered:', serviceId);
                done();
            });
        });
    }
};

//------------------------------------------------------------------------
// Exports
module.exports = configObject;
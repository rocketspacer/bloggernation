if (!process.env.PORT) process.env.PORT = 8081;

//---------------------------------------------------------------------------------
var http    = require('http');
var morgan  = require('morgan');
var express = require('express');
var proxy   = require('express-http-proxy');

//---------------------------------------------------------------------------------
var app = express();

//---------------------------------------------------------------------------------
app.use(morgan('dev'));
app.use(express.static('build'));
app.use('/api', proxy('127.0.0.1:1340', { forwardPath: (req) => req.originalUrl }));
// app.use((req, res) => res.sendFile(__dirname + '/build/index.html'));
app.use((req, res, next) => {
    if (req.originalUrl !== '/index.html') res.redirect('/#!/' + req.originalUrl);
    else next();
});
app.use((req, res) => {
    res.redirect('/index.html');
});

//---------------------------------------------------------------------------------
http.createServer(app)
    .listen(process.env.PORT)
    .on('listening', () => console.log('Server is listening on', process.env.PORT))
    .on('error', (e) => console.log('Error starting server:', e));
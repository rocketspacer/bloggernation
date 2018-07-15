//------------------------------------------------------------------------
// Node Dependencies

//------------------------------------------------------------------------
// External Dependencies
var express = require('express');

//------------------------------------------------------------------------
// Profiles Router 
var newsfeedRouter = express.Router();

//------------------------------------------------------------------------
// Models
var newsfeed = [];

//------------------------------------------------------------------------
// Configurations
var authService = Utils.getService('auth');
var auth    = Utils.getConfig('authentication');

//------------------------------------------------------------------------
// Local account
newsfeedRouter.post('/', auth.resolveToken, (req, res, next) => {
    console.log(req.principle);
    newsfeed.push({
        author: req.principle.username,
        content: req.body.content
    });

    App.io.emit('post', { message: 'new post created'});
    res.status(200).json({messsage: 'success'});
});

newsfeedRouter.get('/', auth.resolveToken, (req, res, next) => {
    res.status(200).json(newsfeed);
});

//------------------------------------------------------------------------
// Exports
module.exports = newsfeedRouter;
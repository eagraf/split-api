const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const config = require('./models/config');

const game = require('./controllers/games.js');


// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, {server: {socketOptions: {keepAlive: 120}}});

var app = express();
var router = express.Router();

// log if in dev mode
if (app.get('env') !== 'production') app.use(logger('dev'));

// run init script from init directory
//require('./init/init');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//================================================
// Middleware
//================================================

// placeholder

//================================================
// Routes
//================================================

// User routes
router.route('/games')
    .post(game.makeGame)
router.route('/games/:id')
    .get(game.getGame)
    .put(game.startGame)
router.route('/games/join/:joinCode')
    .put(game.joinGame)

    
app.use('/', router);

// handle 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500).send();
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send();
});

var server = app.listen(config.port, config.host, function() {
    console.log('Listening at http://%s:%s in %s mode',
    server.address().host, server.address().port, app.get('env'));
});

module.exports = app;



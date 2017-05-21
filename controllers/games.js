const mongoose = require('mongoose');
const haversineOffset = require('haversine-offset');
const Game = require('../models/schemas/game');
const User = require('../models/schemas/user');


// POST /game {name, users:[user1, user2, user3]}
exports.makeGame = (req, res, next) => {

    var gameData = {};

    if (req.body.name && typeof req.body.name === 'string')
        gameData.name = req.body.name;

    
    // Generate random join code
    tryCode(res, gameData);
};

function tryCode(res, gameData) {
    gameData.joinCode = Math.floor(Math.random() * 999999);
    var newGame = new Game(gameData);
    newGame.save((err, game) => {
        if (!err) return res.json(game);
        if (err.code == 11000) tryCode();
    });
}


// POST /games/<game_id> {name: new_name}. Not crucial
exports.updateGame = (req, res, next) => {
    return res.send(200);
};

//exports.deleteGame

// GET /games/:id
exports.getGame = (req, res, next) => {
    game = Game.findById(req.params.id, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that id');

        res.status(200).json(game);
    });
};

exports.startGame = (req, res, next) => {
    // Determine beacons
    
    // Determine code start points

    
    //TODO Send Notifications


    return res.send(200);
};

// Generates {lat, lng} point within radius of a center {lat, lng}
function mkPointInRadius (radius, center) {
    x_off = getRandDist(-radius, radius);
    y_off = getRandDist(-radius, radius);
    var offset = {x: x_off, y: y_off};
    return haversineOffset(center, offset);
}

// PUT /game/:id/users {name, deviceId}
exports.addUser = (req, res, next) => {
    game = Game.findOne({joinCode: req.params.joinCode}, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that join code');

        user = new User({name: req.body.name, 
                         deviceId: req.body.deviceId});
        user.validate(function (err) {
            if(err) return next(err);

            game.users.push(user);
            game.save(function (err, user, _) {
                if (err) return next(err);
                res.status(200).json(user);
            });

        });
    });
};

function getRandDist(min, max) {
    return Math.random() * (max - min) + min;
}



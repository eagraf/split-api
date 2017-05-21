const Game = require('../models/schemas/game');
const mongoose = require('mongoose');

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


// PUT /game/<game_id> {name: new_name}. Not crucial
exports.updateGame = (req, res, next) => {
    return res.send(200);
};

//exports.deleteGame

// GET /game/<game_id> 
exports.getGame = (req, res, next) => {
    return res.send(200);
};

exports.startGame = (req, res, next) => {
    // Determine beacons
    
    // Determine code start points

    
    //TODO Send Notifications


    return res.send(200);
};

exports.addUser = (req, res, next) => {
    return res.send(200);
};



const Game = require('../models/schemas/game');
const mongoose = require('mongoose');

// POST /game {name, users:[user1, user2, user3]}
exports.makeGame = (req, res, next) => {
    return res.send(200);
};

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
    return res.send(200);
};

exports.addUser = (req, res, next) => {
    return res.send(200);
};



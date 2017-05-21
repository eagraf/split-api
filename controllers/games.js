const mongoose = require('mongoose');
const Game = require('../models/schemas/game');
const User = require('../models/schemas/user');

// POST /game {name, users:[user1, user2, user3]}
exports.makeGame = (req, res, next) => {

    var gameData = {};

    if (req.body.name && typeof req.body.name === 'string')
        gameData.name = req.body.name;

    // Generate random join code
    gameData.joinCode = Math.floor(Math.random() * 999999);

    var newGame = new Game(gameData);
    newGame.save((err, game) => {
        if (err) return next(err);
        if (!game) return res.status('Failed to make game').send(400);

        return res.json(game);
    });
};

// PUT /game/<game_id> {name: new_name}. Not crucial
exports.updateGame = (req, res, next) => {
    return res.send(200);
};

//exports.deleteGame

// GET /game/:id
exports.getGame = (req, res, next) => {
    game = Game.findById(req.params('id'), (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(401).send('No game with that id');

        res.status(200).json(game);
    });
};

exports.startGame = (req, res, next) => {
    return res.send(200);
};

// PUT /game/:id/users {name, device_id}
exports.addUser = (req, res, next) => {
    game = Game.findById(req.params('id'), (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(401).send('No game with that id');

        user = new User({name: req.params('name'), 
                         device_id: req.params('device_id')});
        user.validate(function (err) {
            if(err) return next(err);
        });
        game.users.push(user);
        game.save(function (err, user, _) {
            if (err) return next(err);
            res.status(200).json(user);
        });
    });
};



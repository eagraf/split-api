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


// PUT /game/<game_id> {name: new_name}. Not crucial
exports.updateGame = (req, res, next) => {
    return res.send(200);
};

//exports.deleteGame

// GET /game/:id
exports.getGame = (req, res, next) => {
    game = Game.findById(req.params.id, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(401).send('No game with that id');

        res.status(200).json(game);
    });
};

exports.startGame = (req, res, next) => {

    var id = req.params.id;

    Game.findById(id, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('Game not found');

        var numUsers = game.users.length;
        console.log(numUsers);
         
        console.log(req.body.radius + ", " + typeof req.body.radius);
        if (!req.body.radius || typeof req.body.radius !== 'number')
            return res.status(400).send('Must provide a radius');
        if (!req.body.lat || typeof req.body.lat !== 'number')
            return res.status(400).send('Must provide latitude');
        if (!req.body.lng || typeof req.body.lng !== 'number')
            return res.status(400).send('Must provide longitude');

        var radius = req.body.radius;
        var latlng = {lat: req.body.lat, lng: req.body.lng};
        
        // Determine beacons
        var beacons = generateBeacons(5, radius, latlng);
        console.log(beacons);
        
        // Determine code start points
        

        Game.findByIdAndUpdate(id, {beacons: beacons}, (err, game) => {
            if (err) return next(err);
            if (!game) return res.status(400).send('Failed to start game');

            return res.json(game);
        });
        
        //TODO Send Notifications


     });
};


function generateBeacons(num, radius, latlng) {
    var beacons = [];
    for (var i = 0; i < num; i++) {
        beacons.push(mkPointInRadius(radius, latlng));
    }

    return beacons;
}

// PUT /game/:id/users {name, device_id}
// Generates {lat, lng} point within radius of a center {lat, lng}
function mkPointInRadius (radius, center) {
    var offset = {x: radius, y: radius};
    return haversineOffset(center, offset);
}

// PUT /game/:id/users {name, deviceId}
exports.addUser = (req, res, next) => {
    game = Game.findOne({joinCode: req.params.joinCode}, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(401).send('No game with that join code');

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



const mongoose = require('mongoose');
const haversineOffset = require('haversine-offset');
const shuffle = require('shuffle-array');
const Game = require('../models/schemas/game');
const User = require('../models/schemas/user');

var numKeys = 50;


// POST /game {name}
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
        if (err.code == 11000) tryCode(res, gameData);
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

    var id = req.params.id;
    console.log(req.body);

    Game.findById(id, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('Game not found');

        if (!game.started){

            if (!req.body.radius || typeof req.body.radius !== 'number')
                return res.status(400).send('Must provide a radius');
            if (!req.body.lat || typeof req.body.lat !== 'number')
                return res.status(400).send('Must provide latitude');
            if (!req.body.lng || typeof req.body.lng !== 'number')
                return res.status(400).send('Must provide longitude');

            var radius = req.body.radius;
            var latlng = {lat: req.body.lat, lng: req.body.lng};
            var numUsers = game.users.length;
            var numMafia = Math.round(numUsers/3);
            var numGood = numUsers - numMafia;

            // Determine beacons
            var beacons = generateBeacons(numUsers, radius, latlng);

            // Determine code start points
            var key = generateKey(numGood);

            // [{code: 12, location: {lat:lat, lng:lng}, ...]
            var userCodes = generateUserCodes(key, numGood, radius, latlng);

            // Assign mafia roles. Maf _initially_ get a random code
            var mafAssign = [];
            var users = game.users;
            for (var i = 0; i < numMafia; i++) {
                mafAssign.push({mafStatus: true, code: userCodes[getRandInt(0, numGood)]});
            }
            for (var i = 0; i < numGood; i++) {
                mafAssign.push({mafStatus: false, code: userCodes[i]});
            }
            shuffle(mafAssign);

            for (var i = 0; i < numUsers; i++) {
                var userInfo = mafAssign[i];
                users[i].mafia = userInfo.mafStatus;
                users[i].code = userInfo.code; 
            }
            
            gameUpdate = {beacons: beacons, started: true, 
                          users: users, key: key}
            Game.findByIdAndUpdate(id, gameUpdate, (err, game) => {
                if (err) return next(err);
                if (!game) return res.status(400).send('Failed to start game');

                return res.json(game);
            });
        }
        else return res.status(400).send('Game already started.');
        
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

function generateKey (numGood) {
    var key = [];
    for(var i = 0; i < numGood; i++){
        // Random integer key between 0 and numKeys
        k = {code: getRandInt(0, numKeys)}
        key.push(k);
    }

    shuffle(key);

    for(var i = 0; i < numGood; i++){
        key[i].location = i;
    }

    return key;
}

function generateUserCodes (key, numGood, radius, latlng) {
    var codes = key;
    for(var i = 0; i < numGood; i++){
        codes[i].location = mkPointInRadius(radius, latlng)
    }
    return codes;
}

// PUT /game/:id/users {name, device_id}
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

function getRandInt(min, max) {
    return Math.floor(getRandDist(0, getRandDist(min, max)));
}


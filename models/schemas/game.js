const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

var gameSchema = new Schema({
        name: {type: String, required: true, trim: true},
        joinCode: {type: Number, unique: true},
        beacons: [{
            lat: Number,
            lng: Number
        }],
        users: [{}],
        started: false,
        startTime: {type: Date},
        key: {type: [{}]},
        token: {type: String, required: true}
    },
    {
        toObject: {getters: true},
        toJSON: {getters: true},
        timestamps: {
            createdAt: 'createdDate',
        }
    }
);

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;

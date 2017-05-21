const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

var gameSchema = new Schema({
        name: {type: String, required: true, trim: true},
        joinCode: {type: Number, unique: true},
        users: {type: [Schema.objectId], ref: User},
        beacons: [{
            lat: Number,
            lng: Number
        }],
        users: {},
        startTime: {type: Date}
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

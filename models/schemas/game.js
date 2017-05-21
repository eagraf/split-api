const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var gameSchema = new Schema({
        name: {type: String, required: true, trim: true},
        joinCode: {type: Number, unique: true},
        users: {type: [Schema.objectId], ref: User},
        beacons: [{
            lat: Number,
            lon: Number
        }],
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

var User = mongoose.model('User', new Schema({
    name: {type: String, required: true, trim: true},
    code: {
        lat: Number,
        lon: Number,
    }
}));

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;

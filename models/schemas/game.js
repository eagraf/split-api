const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var gameSchema = new Schema({
        name: {type: String, required: true, trim: true},
        users: {type: [Schema.objectId], required: true, ref: User},
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
    name: {type: String, required: true, trim: true}
}));

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;

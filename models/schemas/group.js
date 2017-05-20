const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

var groupSchema = new Schema({
    name: {type: String, required: true, trim: true},
    users: {type: [User], required: true},
    objective: {type: String, trim: true}
    {
        toObject: {getters: true},
        toJSON: {getters: true},
        timestamps: {
            createdAt: 'createdDate',
        }
    }
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;

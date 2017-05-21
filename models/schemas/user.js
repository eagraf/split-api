const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var User = mongoose.model('User', new Schema({
    name: {type: String, required: true, trim: true},
    device_id: {type: String, required: true}
}));

module.exports = User;
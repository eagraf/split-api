const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('email-validator');

var userSchema = new Schema({
        name: {type: String, required: true},
    },
);


// Validate email before saving document.
userSchema.pre('save', function(next) {
    // use email-validator or regex from emailregex.com
    if (!validator.validate(this.email) || 
            !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email))
        return next(new Error('Invalid email'));
    if (this.isModified('hash'))
        this.hash = bcrypt.hashSync(this.hash);

    next();
});


// Validate password.
userSchema.methods.comparePassword = function(pw, callback) {
    bcrypt.compare(pw, this.hash, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};


var User = mongoose.model('User', userSchema);

module.exports = User;

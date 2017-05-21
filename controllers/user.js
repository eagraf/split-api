const mongoose = require('mongoose');
const User = require('../models/schemas/user');

/*
 * Get a user
 */
exports.getUserById = (req, res, next) => {
    // Ensure valid id is passed.
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid params');

    // Perform find query.
    User.findById(req.params.id)
        .select('-hash')
        .exec((err, user) => {
            if (err) return next(err);
            if (!user) return res.status(404).send('No user with that ID');

            return res.json(user);

        });
};

/*
 * Register a new user!
 */
exports.createUser = (req, res, next) => {
    var userData = {};

    // validate name
    if (req.body.username && typeof req.body.username === 'string')
        userData.username = req.body.username;
    else
        return res.status(400).send('Must provide a username');

    // validate email
    // http://emailregex.com
    if (req.body.email) {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
            return res.status(400).send('Invalid email');
        else
            userData.email = req.body.email;
    }

    if (req.body.password) userData.hash = req.body.password;
    if (req.body.hash) userData.hash = req.body.hash;
    

    // Save new user.
    var newUser = new User(userData);
    newUser.save((err, user) => {
        if (err) {
            if (err.code === 11000) return res.status(400).send('Email taken');
            return next(err);
        }            
        return res.json(user);
    });
};

var User = require('../models/user');
var moment = require('moment');

exports.user_signup = function (req, res) {
    
    let params = {
        email: req.body.email,
        password: req.body.password.pwd
    };

    let newUser = new User();
    
    newUser.user_signup(params).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({
            message: 'Could not create the user account.',
            error: err,
            status: 500
        });
    });
};


exports.user_logout = function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                res.status(500).json({ message: 'Session not found', error: err, status: 500 });
            } else {
                res.status(200).json({message: 'Logout successful', status: 200 });
            }
        });
    }
};
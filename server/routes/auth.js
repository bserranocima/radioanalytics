// load up the user model
var user_controller = require('../controllers/userController');

module.exports = function (app, passport) {
    // login
    app.post("/login", passport.authenticate('local-login'), function (req, res) {        
        res.json(req.user);
    });

    // logout
    app.post("/logout", function (req, res) {
        req.logOut();
        res.status(200).json({message: 'Logout successfully'});
    });


    // loggedin
    app.get("/loggedin", function (req, res) {

        if (req.isAuthenticated()){
            res.status(200).json(req.user);
        }
        else{
            res.status(401).json({message: 'User is not logged in'});
        }
    });

    // signup
    app.post("/signup", user_controller.user_signup);

};
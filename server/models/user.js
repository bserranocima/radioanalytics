var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// define the schema for our user model
var userSchema = mongoose.Schema({
    email: String,
    password: String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function (password) {

    console.log(password);
    
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {    
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.user_signup = function(params){
    
    return new Promise((resolve, reject) => {
        User.findOne({
            email: params.email
        }, function (err, user) {
            
            if(err) reject(err);
            
            if (user) {
                reject({ message: 'User already registered' });
            } else {
                var newUser = new User();
                newUser.email = params.email;
                newUser.password = newUser.generateHash( params.password );
                newUser.save(function (err, user) {
                    if(err) reject(err);
                    
                    resolve(user);
                });
            }
        });
    });
};

var User = mongoose.model('User', userSchema);

// create the model for users and expose it to our app
module.exports = User;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        done(null, id);
    } else {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    }
});

//local strategy

passport.use('loginUsers', new LocalStrategy((username, password, done) => {
    var newpassword = crypto.createHash('md5').update(password).digest('hex');
    User
        .findOne({login: username})
        .then(item => {
            if (item && newpassword === item.password) {
                let user = {
                    username: item.login,
                    password: item.password,
                    id: item._id
                };
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            console.log(err);
        })
}));

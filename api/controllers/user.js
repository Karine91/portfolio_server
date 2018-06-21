const mongoose = require('mongoose');
const passport = require('passport');

module.exports.isAuth = function (req, res, next) {
  passport.authenticate('loginUsers', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({status: 'error', message: 'ACCESS DENIED: <br> <span class="msg-description">Укажите правильный логин и пароль!</span>'})
    }
    req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.status(200).json({status: 'ok', message: 'Все ок, Добро пожаловать'});
    });
  })(req, res, next);
}
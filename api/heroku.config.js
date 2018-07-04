const heroku = {};

if (process.env.NODE_ENV === 'production') {
    heroku.server = "https://karine-portfolio.herokuapp.com";
    heroku.database = process.env.MONGOLAB_URI;
    heroku.user = process.env.MAIL_USER;
    heroku.password = process.env.MAIL_PASS;
}

if (process.env.NODE_ENV === 'development') {
    heroku.server = 'http://localhost:3000';
    const herokuDev = require('./devconfig');
    heroku.database = herokuDev.dbConnect;
    heroku.user = herokuDev.user;
    heroku.password = herokuDev.pass;
}

module.exports = heroku;

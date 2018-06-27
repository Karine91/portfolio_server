const http = require('request');
const apiOptions = {
  server: "https://karine-portfolio.herokuapp.com"
};

module.exports.getIndex =  function(req, res) {
    res.render('pages/index', { title: 'Добро пожаловать', msg: req.query.msg  });
}
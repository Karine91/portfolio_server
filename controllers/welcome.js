const http = require('request');
const apiOptions = {
  server: "http://localhost:3000"
};

module.exports.getIndex =  function(req, res) {
    res.render('pages/index', { title: 'Добро пожаловать', msg: req.query.msg  });
}
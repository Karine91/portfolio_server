const http = require('request');
const heroku = require('../api/heroku.config');
const apiOptions = {
  server: heroku.server
}

module.exports.getWorks = function (req, res) {
    const pathAPI = '/api/works';
    const requestOptions = {
        url: apiOptions.server + pathAPI,
        method: 'GET',
        json:{}
    };
    const sendObj = { 
        title: 'Мои работы',
        msg: req.query.msg,
        msgfile: req.query.msgfile,  
    };
    http(requestOptions, function(error, response, body){
        res.render('pages/works', Object.assign(sendObj, body));
    })
}
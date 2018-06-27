const http = require('request');

const apiOptions = {
  server: "https://karine-portfolio.herokuapp.com"
}

module.exports.getAbout=  function(req, res) {
    const pathAPI = '/api/skills-types';
    const requestOptions = {
        url: apiOptions.server + pathAPI,
        method: 'GET',
        json:{}
    };
    const sendObj = { title: 'Обо мне' };
    http(requestOptions, function(error, response, body){
        res.render('pages/about', Object.assign(sendObj, {skilltypes: body}));
    })
}
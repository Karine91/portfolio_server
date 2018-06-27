const http = require('request');

const apiOptions = {
  server: "https://karine-portfolio.herokuapp.com"
}


module.exports.getBlog =  function(req, res) {
  const pathAPI = '/api/blog';
  const requestOptions = {
    url: apiOptions.server + pathAPI,
    method: 'GET',
    json:{}
  };
  const sendObj = { title: 'Блог' };
  http(requestOptions, function(error, response, body){
    res.render('pages/blog', Object.assign(sendObj, body));
  })
  
}
const nodemailer = require('nodemailer');
const config = require('../config.json');
const http = require('request');

const apiOptions = {
    server: "http://localhost:3000"
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

module.exports.sendEmail = function(req, res){
    if(!req.body.name || !req.body.email || !req.body.message){
        return res.redirect('/works?msg=Заполните пожалуйста все поля');
    }
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: `"${req.body.name}" <${req.body.email}>`,
        to: config.mail.smtp.auth.user,
        subject: config.mail.subject,
        text: req.body.message.trim().slice(0,500) + `\n Отправлено с: <${req.body.email}>` 
    }
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return res.redirect('/works?msg=При отправке письма произошла ошибка' + error);
        }
        res.redirect('/works?msg=Ваше сообщение успешно отправлено!')
    });
}
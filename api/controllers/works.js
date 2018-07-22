const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({dest: 'public/upload'}).single('file');
const heroku = require('../heroku.config');


module.exports.getWorks = function (req, res){
    const works = mongoose.model('works');
    works.find().then(items => {
        res.status(200).json({works: items});
    })
}

module.exports.addWork = function (req, res){
    //создаем новую запись блога и передаем в нее поля из формы
    let uploadDir = 'public/upload';

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    
    upload(req, res, function (err) {
      if (err) {
        return res
          .status(400)
          .json({status: 'Не удалось загрузить картинку'});
      }
      if (!req.body.name) {
        return res
          .status(400)
          .json({status: 'Не указано описание картинки!'});
      }
      fs.readFile(req.file.path, function (err, data) {
        if(err) {
          console.log(err);
        }
        let picture = new Buffer(data).toString('base64');
        let pic = `data:${req.file.mimetype};base64,${picture}`;
        const Model = mongoose.model('works');
        if(req.body.link.indexOf('http://') == -1 && req.body.link.indexOf('https://') == -1) {
          req.body.link = 'http://' + req.body.link;
        }
        let item = new Model({
          name: req.body.name,
          technology: req.body.tech,
          link: req.body.link,
          picture: pic
        });
        //сохраняем запись в базе
        item
          .save()
          .then(item => {
            return res
              .status(201)
              .json({status: 'Запись works успешно добавлена', item});
          }, err => {
            //если есть ошибки, то получаем их список и так же передаем
            const error = Object
              .keys(err.errors)
              .map(key => err.errors[key].message)
              .join(', ');

            //обрабатываем  и отправляем
            res
              .status(404)
              .json({
                status: 'При добавление записи произошла ошибка: ' + error
              });
          });  
      });      
    });
}

module.exports.editWork = function (req, res){
  //создаем новую запись блога и передаем в нее поля из формы
  let uploadDir = 'public/upload';

  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
  }
  const id = req.params.id;

  upload(req, res, function (err) {
    if (err) {
      return res
        .status(400)
        .json({status: 'Не удалось загрузить картинку'});
    }
    if (!req.body.name) {
      return res
        .status(400)
        .json({status: 'Не указано описание картинки!'});
    }
    if(req.body.link.indexOf('http://') == -1 && req.body.link.indexOf('https://') == -1) {
      req.body.link = 'http://' + req.body.link;
    }
    let data = {
      name: req.body.name,
      technology: req.body.tech,
      link: req.body.link
    }
    const Model = mongoose.model('works');
    Model
      .findByIdAndUpdate(id, {$set: data}, { new: true } )
      .then(item => {
        if(req.file){
          fs.readFile(req.file.path, function (err, dataFile) {
            if(err) {
              console.log(err);
            }
            let picture = new Buffer(dataFile).toString('base64');
            let pic = `data:${req.file.mimetype};base64,${picture}`;
            //сохраняем запись в базе
            Model
              .findByIdAndUpdate(id, {$set: {picture: pic}}, { new: true })
              .then(itemPic => {
                return res
                  .status(201)
                  .json({status: 'Запись works успешно добавлена', item: itemPic});
              }, err => {
                //если есть ошибки, то получаем их список и так же передаем
                let error = Object
                  .keys(err.errors)
                  .map(key => err.errors[key].message)
                  .join(', ');
    
                //обрабатываем  и отправляем
                res
                  .status(404)
                  .json({
                    status: 'При добавление картинки произошла ошибка: ' + error
                  });
              });  
          }); 
        }else{
          return res
            .status(201)
            .json({status: 'Запись works успешно добавлена', item});
        }
      }, err => {
        let error = Object
          .keys(err.errors)
          .map(key => err.errors[key].message)
          .join(', ');
        res
          .status(404)
          .json({
            status: 'При добавление записи произошла ошибка: ' + error
          });  
      })
    
         
  });
}

module.exports.deleteWork = function (req, res) {
  const id = req.params.id;
  const Model = mongoose.model('works');

  Model
      .findByIdAndRemove(id)
      .then((item) => {
        if (!!item) {
            fs.unlink(path.join('public', item.picture));
            res.status(200).json({status: 'Запись успешно удалена'});
        } else {
            res.status(404).json({status: 'Запись в БД не обнаружена'});
        }
      }, (err) => {
          res.status(404).json({
              status: 'При удалении записи произошла ошибка: ' + err
          });
      });
}

module.exports.sendEmail = function (req, res) {
  if(!req.body.name || !req.body.email || !req.body.message){
    return res
      .status(400)
      .json({
        status: 'Заполните пожалуйста все поля'
      });
  }
  const transporter = nodemailer.createTransport({
    "host": "smtp.mail.ru",
    "port": 465,
    "secure": true,
    "auth": {
      "user": heroku.user,
      "pass": heroku.password
    }
  });
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: heroku.user,
    subject: 'Сообщение с сайта портфолио',
    text: req.body.message.trim().slice(0,500) + `\n Отправлено с: <${req.body.email}>` 
  }
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return res
        .status(404)
        .json({
          status: 'error',
          message: 'При отправке письма произошла ошибка' + error
        });
    }
    return res
      .status(200)
      .json({
        status: 'ok',
        message: 'Ваше сообщение успешно отправлено!'
      });
  });
}
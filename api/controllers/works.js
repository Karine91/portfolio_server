const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const nodemailer = require('nodemailer');

module.exports.getWorks = function (req, res){
    const works = mongoose.model('works');
    works.find().then(items => {
        res.status(200).json({works: items});
    })
}

module.exports.addWork = function (req, res){
    //создаем новую запись блога и передаем в нее поля из формы
    let form = new formidable.IncomingForm();
    let upload = 'public/upload';
    let fileName;

    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);
    
    form.parse(req, function(err, fields, files) {
      if (err) {
        return res
          .status(400)
          .json({status: 'Не удалось загрузить картинку'});
      }
      if (!fields.name) {
        fs.unlink(files.file.path);
        return res
          .status(400)
          .json({status: 'Не указано описание картинки!'});
      }
      fileName = path.join(upload, files.file.name);
      console.log(files.file.path, fileName);
      fs.readFile(files.file.path, function (err, data) {
        if(err) {
          console.log(err);
        }
        let pic = {
            data, 
            contentType: 'image/jpg'
        };
        const Model = mongoose.model('works');
        if(fields.link.indexOf('http://') == -1 && fields.link.indexOf('https://') == -1) {
          fields.link = 'http://' + fields.link;
        }
        let item = new Model({
          name: fields.name,
          technology: fields.tech,
          link: fields.link,
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
  let form = new formidable.IncomingForm();
  const id = req.params.id;
  let upload = 'public/upload';
  form.uploadDir = path.join(process.cwd(), upload);
  form.parse(req, function(err, fields, files) {
    console.log(fields, files);
    if (err) {
      return res
        .status(400)
        .json({status: 'Не удалось загрузить картинку'});
    }
    if (!fields.name) {
      fs.unlink(files.file.path);
      return res
        .status(400)
        .json({status: 'Не указано описание картинки!'});
    }
    if(fields.link.indexOf('http://') == -1 && fields.link.indexOf('https://') == -1) {
      fields.link = 'http://' + fields.link;
    }
    let data = {
      name: fields.name,
      technology: fields.tech,
      link: fields.link
    }
    const Model = mongoose.model('works');
    Model
      .findByIdAndUpdate(id, {$set: data}, { new: true } )
      .then(item => {
        if(files.file){
          
          // let fileName;
          // fileName = path.join(upload, files.file.name);
          // console.log('upload avatar', fileName);
          // fs.rename(files.file.path, fileName, function (err) {
          //   if (err) {
          //       console.log(err);
          //       fs.unlink(fileName);
          //       fs.rename(files.file.path, fileName);
          //   }
          //   let dir = fileName.substr(fileName.indexOf('\/'));
          //   console.log(dir);
            fs.readFile(files.file.path, function (err, data) {
              if(err) {
                console.log(err);
              }
              let pic = {
                picture: {
                  data, 
                  contentType: 'image/jpg'
                }
              };
            //сохраняем запись в базе
            Model
              .findByIdAndUpdate(id, {$set: pic}, { new: true })
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
          console.log('no avatar');
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
    "host": smtp.mail.ru,
    "port": 465,
    "secure": true,
    "auth": {
      "user": process.env.MAIL_USER,
      "pass": process.env.MAIL_PASS
    }
  });
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: process.env.MAIL_USER,
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
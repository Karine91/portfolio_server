const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const http = require('request');

const apiOptions = {
  server: "http://localhost:3000"
}

module.exports.getAdminpage = function (req, res) {
    if(!req.body.login || !req.body.password){
        return res.redirect('/?msg=Заполните пожалуйста все поля');
      }
    res.render('admin/admin', { 
        title: 'Админ панель' ,
        msgfile: req.query.msgfile,
        msgblog: req.query.msgblog,
    });
}

module.exports.addWork = function (req, res) {
    let form = new formidable.IncomingForm();
    let upload = 'public/upload';
    let fileName;

    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);
    
    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.redirect('/admin/works?msgfile=Не удалось загрузить картинку');
        }
        if (!fields.name) {
            fs.unlink(files.file.path);
            return res.redirect('/admin/works?msgfile=Не указано описание картинки!');
        }
        console.log(fields, files);
        fileName = path.join(upload, files.file.name);

        fs.rename(files.file.path, fileName, function (err) {
            if (err) {
                console.log(err);
                fs.unlink(fileName);
                fs.rename(files.file.path, fileName);
            }
            const pathApi = '/api/works';
            let dir = fileName.substr(fileName.indexOf('\\'));
            const requestOptions = {
                url: apiOptions.server + pathApi,
                method: "POST",
                json: {
                    name: fields.name,
                    tech: fields.tech,
                    file: dir
                }
            };

            http(requestOptions, function (error, response, body) {
                if (error) {
                    return res.redirect('/admin/works?msgfile=Картинка не сохранилась в БД');
                }
                res.redirect('/admin/works?msgfile=Картинка успешно загружена');
            });

        });
        
    });

}

module.exports.addArticle = function (req, res) {
  const pathApi = '/api/blog';
  const requestOptions = {
    url: apiOptions.server + pathApi,
    method: "POST",
    json: {
      name: req.body.name,
      date: req.body.date,
      text: req.body.text
    }
  };

  http(requestOptions, function (error, response, body) {
    res.redirect('/admin?msgblog=' + body.status);
  });
}
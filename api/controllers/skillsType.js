const mongoose = require('mongoose');

module.exports.getSkillsTypes = function (req, res){
    const skillsTypes = mongoose.model('skillsType');
    skillsTypes.find().then(items => {
        res.status(200).json(items.length ? items : []);
    });
}

module.exports.addSkillType = function (req, res){
    //создаем новую запись блога и передаем в нее поля из формы
  const Model = mongoose.model('skillsType');
  let item = new Model({
    name: req.body.name,
    skills: []
  });
  //сохраняем запись в базе
  item
    .save((err, item) => {
        if(err) {
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
        } else {
            return res
                .status(201)
                .json({status: 'Запись успешно добавлена', item});
        }
    });
}

module.exports.editSkillType = function (req, res) {
    const id = req.params.id;

    let data = {
        name: req.body.name
    };
    
    const Model = mongoose.model('skillsType');

    Model
        .findByIdAndUpdate(id, {$set: data} )
        .then((item) => {
            if (!!item) {
                res
                .status(200)
                .json({status: 'Запись успешно обновлена'});
            } else {
                res
                .status(404)
                .json({status: 'Запись в БД не обнаружена'});
            }
        })
        .catch((err) => {
            res
                .status(404)
                .json({
                    status: 'При обновлении записи произошла ошибка: ' + err
                });
        });
}

module.exports.deleteSkillType = function (req, res) {
    const id = req.params.id;
    const Model = mongoose.model('skillsType');
  
    Model
        .findByIdAndRemove(id)
        .then((item) => {
            if (!!item) {
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
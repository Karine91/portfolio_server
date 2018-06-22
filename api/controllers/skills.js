const mongoose = require('mongoose');

module.exports.getSkills = function (req, res){
    const skillsList=[];

    const skills = mongoose.model('skills');
    skills.find().then(items => {
        res.status(200).json({skills: items.length ? items : []});
    });
}

module.exports.addSkill = function (req, res){
    //создаем новую запись блога и передаем в нее поля из формы
    const ModelSkills = mongoose.model('skills');
    let item = new ModelSkills({
        name: req.body.name,
        percents: req.body.percents,
        type: req.body.type
    });
    //сохраняем запись в базе
    mongoose.model('skillsType').findOne({type: req.body.type}, (err, skilltype) => {
        if(skilltype){
           skilltype.skills.push(item); 
        }
        skilltype.save()
            .then(item => {
            return res
                .status(201)
                .json({status: 'Запись успешно добавлена', item: item.skills[item.skills.length -1]});
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
    })
    
    
}

module.exports.editSkill = function (req, res) {
    const id = req.params.id;

    let skillsTypeModel = mongoose.model('skillsType');
    var ObjectId = mongoose.Types.ObjectId;
    let data = {
        _id: ObjectId(id),
        name: req.body.name,
        percents: req.body.percents,
        type: req.body.type
    };
    skillsTypeModel.update({'skills._id': ObjectId(id)} , {$set: {'skills.$': data}}).then((item) => {
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

module.exports.deleteSkill = function (req, res) {
    const id = req.params.id;
    const Model = mongoose.model('skillsType');
    var ObjectId = mongoose.Types.ObjectId;

    Model.update({} , {$pull: {skills: {'_id': ObjectId(id)}}})
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
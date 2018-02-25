const mongoose = require('mongoose');

module.exports.getWorks = function (req, res){
    const work=[];


    const works = mongoose.model('works');
    works.find().then(items => {
        if(!items.length){
            res.status(200).json({works: work});
        }else{
            res.status(200).json({works: items});
        }
    })
}

module.exports.addWork = function (req, res){
    //создаем новую запись блога и передаем в нее поля из формы
  const Model = mongoose.model('works');

  let item = new Model({
    name: req.body.name,
    technology: req.body.tech,
    picture: req.body.file
  });
  //сохраняем запись в базе
  console.log(item);
  item
    .save()
    .then(item => {
      return res
        .status(201)
        .json({status: 'Запись works успешно добавлена'});
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
}
module.exports.getIndex =  function(req, res) {
    res.render('pages/index', { title: 'Добро пожаловать', msg: req.query.msg  });

}
module.exports.authorization=  function(req, res) {
  if(!req.body.login || !req.body.password){
    return res.redirect('/?msg=Заполните пожалуйста все поля');
  }
  res.render('admin/admin', { title: 'Админ панель' });
}
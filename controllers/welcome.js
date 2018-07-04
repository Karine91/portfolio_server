module.exports.getIndex =  function(req, res) {
    res.render('pages/index', { title: 'Добро пожаловать', msg: req.query.msg  });
}
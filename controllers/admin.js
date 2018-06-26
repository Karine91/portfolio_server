module.exports.getAdminpage = function (req, res) {
    res.render('admin/admin', { 
        title: 'Админ панель' ,
        msgfile: req.query.msgfile,
        msgblog: req.query.msgblog,
    });
}

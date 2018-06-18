const express = require('express');
const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .send('Авторизируйтесь');
}
// const isAdmin = (req, res, next) => {
//     // если в сессии текущего пользователя есть пометка о том, что он является
//     // администратором
//     if (req.session.isAdmin) {
//       //то всё хорошо :)
//       return next();
//     }
//     //если нет, то запрещаем доступ к API
//     res.status(403).json({message: 'Access denied'});
// };

const ctrlBlog = require('../controllers/blog');
const ctrlWorks = require('../controllers/works');
const ctrlUser = require('../controllers/user');

router.post('/user', ctrlUser.isAuth);

router.get('/blog', ctrlBlog.getArticles);
router.post('/blog', isLoggedIn, ctrlBlog.createArticle);
router.put('/blog/:id', isLoggedIn, ctrlBlog.editArticle);
router.delete('/blog/:id', isLoggedIn, ctrlBlog.deleteArticle);

router.get('/works', ctrlWorks.getWorks); //переделать загрузку картинок
router.post('/works', ctrlWorks.addWork);


module.exports = router;
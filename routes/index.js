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

const ctrlWelcome = require('../controllers/welcome');
const ctrlAdmin = require('../controllers/admin');
const ctrlBlog = require('../controllers/blog');
const ctrlWorks = require('../controllers/works');
const ctrlAbout = require('../controllers/about');

/* GET home page. */
router.get('/', ctrlWelcome.getIndex);

router.get('/blog', ctrlBlog.getBlog);


router.get('/works', ctrlWorks.getWorks);
router.post('/contact', ctrlWorks.sendEmail);


router.get('/about', ctrlAbout.getAbout);

router.get('/admin', isLoggedIn, ctrlAdmin.getAdminpage);
router.post('/admin/work', isLoggedIn, ctrlAdmin.addWork);
router.get('/admin/works', isLoggedIn, ctrlWorks.getWorks);
router.post('/admin/blog', isLoggedIn, ctrlAdmin.addArticle);

module.exports = router;

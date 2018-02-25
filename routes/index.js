const express = require('express');
const router = express.Router();

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
router.get('/admin/works', ctrlWorks.getWorks);

router.get('/about', ctrlAbout.getAbout);

router.post('/admin', ctrlAdmin.getAdminpage);
router.post('/admin/work', ctrlAdmin.addWork);
// router.post('/admin/blog', ctrlAdmin.addArticle);
module.exports = router;

const express = require('express');
const router = express.Router();

const ctrlWelcome = require('../controllers/welcome');
const ctrlBlog = require('../controllers/blog');
const ctrlWorks = require('../controllers/works');
const ctrlAbout = require('../controllers/about');

/* GET home page. */
router.get('/', ctrlWelcome.getIndex);
router.post('/', ctrlWelcome.authorization);

router.get('/blog', ctrlBlog.getBlog);

router.get('/works', ctrlWorks.getWorks);
router.post('/contact', ctrlWorks.sendEmail);


router.get('/about', ctrlAbout.getAbout);
module.exports = router;

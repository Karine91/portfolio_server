const express = require('express');
const router = express.Router();

const ctrlBlog = require('../controllers/blog');
const ctrlWorks = require('../controllers/works');

router.get('/blog', ctrlBlog.getArticles);
router.post('/blog', ctrlBlog.createArticle);
router.put('/blog/:id', ctrlBlog.editArticle);
router.delete('/blog/:id', ctrlBlog.deleteArticle);

router.get('/works', ctrlWorks.getWorks);
router.post('/works', ctrlWorks.addWork);


module.exports = router;
const express = require('express');
const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .redirect('/');
  return next();
}

const ctrlBlog = require('../controllers/blog');
const ctrlWorks = require('../controllers/works');
const ctrlUser = require('../controllers/user');
const ctrlSkills = require('../controllers/skills');
const ctrlSkillsTypes = require('../controllers/skillsType');


router.post('/user', ctrlUser.isAuth);

router.get('/blog', ctrlBlog.getArticles);
router.post('/blog', isLoggedIn, ctrlBlog.createArticle);
router.patch('/blog/:id', isLoggedIn, ctrlBlog.editArticle);
router.delete('/blog/:id', isLoggedIn, ctrlBlog.deleteArticle);

router.get('/skills', ctrlSkills.getSkills);
router.post('/skills', isLoggedIn, ctrlSkills.addSkill);
router.patch('/skills/:id', isLoggedIn, ctrlSkills.editSkill);
router.delete('/skills/:id', isLoggedIn, ctrlSkills.deleteSkill);

router.get('/skills-types', ctrlSkillsTypes.getSkillsTypes);
router.post('/skills-types',isLoggedIn, ctrlSkillsTypes.addSkillType);
router.patch('/skills-types/:id', isLoggedIn, ctrlSkillsTypes.editSkillType);
router.delete('/skills-types/:id', isLoggedIn, ctrlSkillsTypes.deleteSkillType);

router.get('/works', ctrlWorks.getWorks);
router.post('/works', isLoggedIn, ctrlWorks.addWork);
router.post('/contact', ctrlWorks.sendEmail);
router.patch('/works/:id', isLoggedIn, ctrlWorks.editWork);
router.delete('/works/:id', isLoggedIn, ctrlWorks.deleteWork);


module.exports = router;
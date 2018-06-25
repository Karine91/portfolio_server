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

const ctrlBlog = require('../controllers/blog');
const ctrlWorks = require('../controllers/works');
const ctrlUser = require('../controllers/user');
const ctrlSkills = require('../controllers/skills');
const ctrlSkillsTypes = require('../controllers/skillsType');


router.post('/user', ctrlUser.isAuth);

router.get('/blog', ctrlBlog.getArticles);
router.post('/blog', isLoggedIn, ctrlBlog.createArticle);
router.patch('/blog/:id',ctrlBlog.editArticle);
router.delete('/blog/:id', isLoggedIn, ctrlBlog.deleteArticle);

router.get('/skills', ctrlSkills.getSkills);
router.post('/skills', ctrlSkills.addSkill);
router.patch('/skills/:id', ctrlSkills.editSkill);
router.delete('/skills/:id', ctrlSkills.deleteSkill);

router.get('/skills-types', ctrlSkillsTypes.getSkillsTypes);
router.post('/skills-types', ctrlSkillsTypes.addSkillType);
router.patch('/skills-types/:id', ctrlSkillsTypes.editSkillType);
router.delete('/skills-types/:id', ctrlSkillsTypes.deleteSkillType);

router.get('/works', ctrlWorks.getWorks); //переделать загрузку картинок
router.post('/works', ctrlWorks.addWork);


module.exports = router;
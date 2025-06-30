const router = require('express').Router();
const {body}=require("express-validator")
const authMiddleware = require('../middleware/auth.middleware');
const HomeController=require('../controller/Home.Controller')

router.get('/home', authMiddleware.authUser, HomeController.showHome);
router.get('/home/categories',authMiddleware.authUser,HomeController.showCategories)


module.exports = router;
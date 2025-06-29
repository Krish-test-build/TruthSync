const router = require('express').Router();
const {body}=require("express-validator")
const SignUpController = require('../controller/SignUp.Controller');
const LoginController = require('../controller/Login.Controller');
const authMiddleware = require('../middleware/auth.middleware');
const LogoutController=require('../controller/Logout.Controller')
const ProfileController=require('../controller/Profile.Controller')
const uploadMiddleware=require('../middleware/upload.middleware')




router.get('/', (req, res) => {
    res.send('This is the truthSync backend');
})

router.post('/signup',uploadMiddleware.single('image'),[
    body('firstName').isLength({ min: 1, max: 20 }).withMessage('First name must be specified'),
    body('lastName').isLength({ min: 1, max: 20 }).withMessage('Last name must be specified'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('username').isLength({ min: 1, max: 20 }).withMessage('Username must be between 1-20 characters').
    matches(/^[A-Za-z0-9@$%#&_]+$/).withMessage('Username must Only Contain Alphabets,Numbers and special characters (@, $, %, #, &, _)'),
    body('password').isLength({ min: 5, max: 15 }).matches(/^[A-Z][A-Za-z0-9@$%#&]{4,14}$/).matches(/[@$%#&]/).withMessage('Password must start with an uppercase letter and include one special character (@, $, %, #, &)'),
], SignUpController.signUpUser);

router.post('/login',[
    body('username').isLength({ min: 1, max: 20 }).withMessage('Username must be between 1-20 characters').
    matches(/^[A-Za-z0-9@$%#&_]+$/).withMessage('Username must Only Contain Alphabets,Numbers and special characters (@, $, %, #, &, _)'),
    body('password').isLength({ min: 5, max: 15 }).matches(/^[A-Z][A-Za-z0-9@$%#&_]{4,14}$/).matches(/[@$%#&]/).withMessage('Password must start with an uppercase letter and include one special character (@, $, %, #, &)'),
], LoginController.loginUser);


router.get('/home', authMiddleware.authUser, ProfileController.getUserHome);
router.get('/logout', authMiddleware.authUser,LogoutController.logoutUser); 
router.get('/profile', authMiddleware.authUser, ProfileController.getProfile);
router.put('/profile', authMiddleware.authUser,uploadMiddleware.single('image'), ProfileController.updateProfile);

module.exports = router
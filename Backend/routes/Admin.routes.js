const express = require('express');
const router = express.Router();
const profileController = require('../controller/Profile.Controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/profile', authMiddleware.authAdmin, profileController.adminProfile);

module.exports = router;
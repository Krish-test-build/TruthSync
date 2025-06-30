const express = require('express');
const router = express.Router();
const profileController = require('../controller/Profile.Controller');
const authMiddleware = require('../middleware/auth.middleware');
const AdminClaimController = require('../controller/AdminClaim.Controller');


router.get('/profile', authMiddleware.authAdmin, profileController.adminProfile);
router.get('/users', authMiddleware.authAdmin, profileController.getAllUsers);
router.patch('/claim/:id/status', authMiddleware.authAdmin, AdminClaimController.moderateClaim);
router.get('/claims/pending',authMiddleware.authAdmin,AdminClaimController.getPendingClaims);
router.get('/claims/stats',authMiddleware.authAdmin,AdminClaimController.getStats);


module.exports = router;
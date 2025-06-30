const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const voteController = require('../controller/Vote.Controller');

router.post('/claim/:id/vote', authMiddleware.authUser, voteController.voteClaim);

module.exports = router;
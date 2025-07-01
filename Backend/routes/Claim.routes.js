const claimController = require('../controller/Claim.Controller');
const authMiddleware = require('../middleware/auth.middleware');
const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/upload.middleware');


const {body}=require("express-validator")



router.post('/new-claim', authMiddleware.authUser,uploadMiddleware.single('image'),[
    body('title').isLength({ min: 1, max: 20 }).withMessage('Title must be between 1-20 characters'),
    body('description').isLength({ min: 1, max: 200 }).withMessage('Description must be between 1-200 characters'),
    body('category').isIn(['Politics','Health','Education','Entertainment','Science and Tech','Finance','Belief','Miscellaneous']).withMessage('Category must be one of the following: Politics, Health, Education, Entertainment, Science and Tech, Finance, Belief, Miscellaneous'),
    body('isAnonymous').optional().isBoolean().withMessage('isAnonymous must be either true or false'),
], claimController.createClaim);


router.get('/sort',authMiddleware.authUser, claimController.sortClaims);
router.get('/filterBy/:category',authMiddleware.authUser, claimController.filterClaims);
router.get('/my-claims',authMiddleware.authUser, claimController.getMyClaims); 
router.get('/:id',authMiddleware.authUser, claimController.getThisClaim); 
router.put('/update-claim/:id',authMiddleware.authUser, uploadMiddleware.single('image'),[
    body('title').isLength({ min: 1, max: 20 }).withMessage('Title must be between 1-20 characters'),
    body('description').isLength({ min: 1, max: 200 }).withMessage('Description must be between 1-200 characters'),
    body('category').isIn(['Politics','Health','Education','Entertainment','Science and Tech','Finance','Belief','Miscellaneous']).withMessage('Category must be one of the following: Politics, Health, Education, Entertainment, Science and Tech, Finance, Belief, Miscellaneous')]
, claimController.updateClaim);
router.delete('/delete-claim/:id',authMiddleware.authUser, claimController.deleteClaim);

router.post('/:id/comment',authMiddleware.authUser,[
    body('comments').isLength({ min: 1, max: 200 }).withMessage('Comment must be between 1-200 characters'),
], claimController.commentClaim);
router.get('/:id/comments',authMiddleware.authUser, claimController.getComments);
router.delete('/delete-comment/:id',authMiddleware.authUser, claimController.deleteComment);

module.exports = router;
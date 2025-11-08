const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const claimController = require('../controller/Claim.Controller');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

router.post(
  '/new-claim',
  authMiddleware.authUser,
  uploadMiddleware.single('image'),
  [
    body('title').isLength({ min: 1, max: 50 }).withMessage('Title must be 1-50 chars'),
    body('description').isLength({ min: 1, max: 200 }).withMessage('Description must be 1-200 chars'),
    body('category').isIn([
      'Politics','Health','Education','Entertainment','Science and Tech','Finance','Sports','Miscellaneous'
    ]).withMessage('Invalid category'),
    body('isAnonymous').optional().isBoolean().withMessage('isAnonymous must be boolean')
  ],
  claimController.createClaim
);

router.put(
  '/update-claim/:id',
  authMiddleware.authUser,
  uploadMiddleware.single('image'),
  [
    body('title').isLength({ min: 1, max: 20 }).withMessage('Title must be 1-20 chars'),
    body('description').isLength({ min: 1, max: 200 }).withMessage('Description must be 1-200 chars'),
    body('category').isIn([
      'Politics','Health','Education','Entertainment','Science and Tech','Finance','Sports','Miscellaneous'
    ]).withMessage('Invalid category')
  ],
  claimController.updateClaim
);

router.delete('/delete-claim/:id', authMiddleware.authUser, claimController.deleteClaim);

router.post('/:id/bookmark', authMiddleware.authUser, claimController.bookmarkClaim);
router.delete('/:id/bookmark', authMiddleware.authUser, claimController.unbookmarkClaim);

router.post(
  '/:id/comment',
  authMiddleware.authUser,
  uploadMiddleware.single('image'),
  [
    body('comments').isLength({ min: 1, max: 200 }).withMessage('Comment must be 1-200 chars')
  ],
  claimController.commentClaim
);

router.delete('/delete-comment/:id', authMiddleware.authUser, claimController.deleteComment);

router.get('/my-claims', authMiddleware.authUser, claimController.getMyClaims);
router.get('/my-comments', authMiddleware.authUser, claimController.getMyComments);
router.get('/my-bookmarks', authMiddleware.authUser, claimController.getMyBookmarks);
router.get('/sort', authMiddleware.authUser, claimController.sortClaims);
router.get('/filterBy/:category', authMiddleware.authUser, claimController.filterClaims);
router.get('/', authMiddleware.authUser, claimController.getAllClaims);

router.get('/:id', authMiddleware.authUser, claimController.getThisClaim);

router.get('/:id/comments', authMiddleware.authUser, claimController.getComments);

module.exports = router;

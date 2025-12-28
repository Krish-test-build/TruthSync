const claimService = require('../services/Claim.Services');
const { validationResult } = require('express-validator');
const { defaultImage } = require('../config/Default.config');
const moderationServices = require('../services/Moderation.Services');
const ClaimModel = require('../models/Claim.Model');
const CommentModel = require('../models/Comment.Model');
const NotificationModel = require('../models/Notification.Model');
const UserModel = require('../models/SignUp.Model');
const VoteModel = require('../models/Vote.Model');

module.exports.createClaim = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const textToCheck = `${req.body.title} ${req.body.description}`;
    const moderationResult = await moderationServices.checkToxicity(textToCheck);

    const claimData = {
      ...req.body,
      title: req.body.title?.trim(),
      description: req.body.description?.trim(),
      image: req.file ? `/uploads/${req.file.filename}` : defaultImage,
      user: req.user._id,
      status: moderationResult.isFlagged ? 'Pending' : 'Approved',
    };

    const claim = await claimService.newClaim(claimData);
    console.log(`Claim created by user ${req.user._id}: ${claim._id}`);
    res.status(201).json({ message: 'Claim created successfully', claim });
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getMyClaims = async (req, res) => {
  try {
    const claims = await claimService.getClaim(req.user._id);
    res.status(200).json(claims);
  } catch (error) {
    console.error('Error fetching my claims:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getThisClaim = async (req, res) => {
  try {
    const claim = await claimService.getClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    res.status(200).json(claim);
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateClaim = async (req, res) => {
  try {
    const claim = await claimService.getClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    if (claim.user._id.toString() !== req.user._id.toString()) {
      console.log(`Unauthorized update attempt by user ${req.user._id} on claim ${claim._id}`);
      return res.status(403).json({ message: 'Unauthorized: You do not own this claim' });
    }
    const updatedClaim = await claimService.updateClaim(req.params.id, req.body);
    console.log(`Claim updated: ${claim._id} by user ${req.user._id}`);
    res.status(200).json({ message: 'Updated successfully', claim: updatedClaim });
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteClaim = async (req, res) => {
  try {
    const claim = await claimService.getClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    if (claim.user._id.toString() !== req.user._id.toString()) {
      console.log(`Unauthorized delete attempt by user ${req.user._id} on claim ${claim._id}`);
      return res.status(403).json({ message: 'Unauthorized: You do not own this claim' });
    }
    await claimService.deleteClaim(req.params.id);
    console.log(`Claim deleted: ${claim._id} by user ${req.user._id}`);
    res.status(200).json({ message: 'Claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getAllClaims = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select('bookmarks').lean();
    const claims = await ClaimModel.find().sort({ createdAt: -1 }).lean();

    const result = await Promise.all(
      claims.map(async (claim) => {
        const vote = await VoteModel.findOne({ user: req.user._id, claim: claim._id }).lean();
        return {
          ...claim,
          userVote: vote ? vote.voteType : null,
          bookmarked: user.bookmarks.some((id) => id.equals(claim._id)),
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching all claims:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.sortClaims = async (req, res) => {
  try {
    const { sort } = req.query;
    const user = await UserModel.findById(req.user._id).select('bookmarks').lean();

    let claims;

    if (sort === 'TopClaims') {
      claims = await ClaimModel.aggregate([
        {
          $addFields: {
            score: {
              $subtract: [{ $ifNull: ['$upvote', 0] }, { $ifNull: ['$downvote', 0] }],
            },
          },
        },
        { $sort: { score: -1, createdAt: -1 } },
      ]);
    } else {
      claims = await ClaimModel.find().sort({ createdAt: -1 }).lean();
    }

    const result = await Promise.all(
      claims.map(async (claim) => {
        const vote = await VoteModel.findOne({ user: req.user._id, claim: claim._id }).lean();
        return {
          ...claim,
          userVote: vote ? vote.voteType : null,
          bookmarked: user.bookmarks.some((id) => id.equals(claim._id)),
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error sorting claims:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.filterClaims = async (req, res) => {
  try {
    const { category } = req.params;
    const user = await UserModel.findById(req.user._id).select('bookmarks').lean();

    const claims = await ClaimModel.find({ category }).populate('user').lean();

    const result = await Promise.all(
      claims.map(async (claim) => {
        const vote = await VoteModel.findOne({ user: req.user._id, claim: claim._id }).lean();
        return {
          ...claim,
          userVote: vote ? vote.voteType : null,
          bookmarked: user.bookmarks.some((id) => id.equals(claim._id)),
        };
      })
    );

    res.status(200).json({ claim: result });
  } catch (error) {
    console.error('Error filtering claims:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.commentClaim = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const claim = await ClaimModel.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const comment = await CommentModel.create({
      user: req.user._id,
      claim: claim._id,
      comments: req.body.comments,
    });

    if (claim.user.toString() !== req.user._id.toString()) {
      await NotificationModel.create({
        user: claim.user,
        message: `New comment on your claim "${claim.title}"`,
      });
    }

    const populated = await CommentModel.findById(comment._id)
      .populate('user', 'username')
      .populate('claim', 'title');

    console.log(`Comment added by user ${req.user._id} on claim ${claim._id}`);
    res.status(201).json({ comment: populated });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({ claim: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      console.log(`Unauthorized delete attempt by user ${req.user._id} on comment ${comment._id}`);
      return res.status(403).json({ message: 'Unauthorized: You do not own this comment' });
    }

    await comment.deleteOne();
    console.log(`Comment deleted: ${comment._id} by user ${req.user._id}`);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getMyComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({ user: req.user._id })
      .populate({
        path: 'claim',
        select: 'title',
        populate: { path: 'user', select: 'username' },
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching my comments:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getMyBookmarks = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate('bookmarks').lean();
    const formatted = (user.bookmarks || []).map((claim) => ({
      ...claim,
      image: claim.image ? `${req.protocol}://${req.get('host')}/${claim.image}` : null,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.bookmarkClaim = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user.bookmarks.some((id) => id.equals(req.params.id))) {
      return res.status(400).json({ message: 'Already bookmarked' });
    }
    user.bookmarks.push(req.params.id);
    await user.save();
    console.log(`Claim bookmarked: ${req.params.id} by user ${req.user._id}`);
    res.status(200).json({ message: 'Claim bookmarked' });
  } catch (error) {
    console.error('Error bookmarking claim:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.unbookmarkClaim = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    user.bookmarks = user.bookmarks.filter((id) => !id.equals(req.params.id));
    await user.save();
    console.log(`Claim unbookmarked: ${req.params.id} by user ${req.user._id}`);
    res.status(200).json({ message: 'Claim unbookmarked' });
  } catch (error) {
    console.error('Error unbookmarking claim:', error);
    res.status(500).json({ error: error.message });
  }
};
const claimService = require('../services/Claim.Services'); 
const { validationResult } = require('express-validator');
const { defaultImage } = require('../config/Default.config');
const moderationServices = require('../services/Moderation.Services');
const ClaimModel = require('../models/Claim.Model');
const CommentModel = require('../models/Comment.Model'); // ✅ fixed
const NotificationModel = require('../models/Notification.Model');
const UserModel = require('../models/SignUp.Model');

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

    console.log("req.body:", req.body);
    console.log("req.file:", req.file); 

    const claim = await claimService.newClaim(claimData);

    if (moderationResult.isFlagged) {
      console.log('Claim flagged and set to Pending for moderation.');
    }

    res.status(201).json({ message: 'Claim created successfully', claim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getMyClaims = async (req, res) => {
  try {
    const claims = await claimService.getClaim(req.user._id);
    res.status(200).json(claims);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateClaim = async (req, res) => {
  try {
    const claim = await claimService.getClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    if (claim.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedClaim = await claimService.updateClaim(req.params.id, req.body);
    res.status(200).json({ message: 'Updated successfully', claim: updatedClaim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteClaim = async (req, res) => {
  try {
    const claim = await claimService.getClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    if (claim.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await claimService.deleteClaim(req.params.id);
    res.status(200).json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getAllClaims = async (req, res) => {
  try {
    const claims = await ClaimModel.find().sort({ createdAt: -1 });
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.sortClaims = async (req, res) => {
  try {
    const { sort } = req.query;
    let claims;

    if (sort === "MostRecent") {
      claims = await ClaimModel.find().sort({ createdAt: -1 });
    } else if (sort === "Oldest") {
      claims = await ClaimModel.find().sort({ createdAt: 1 });
    } else {
      claims = await ClaimModel.find();
    }

    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.filterClaims = async (req, res) => {
  const { category } = req.params;
  try {
    const claim = await ClaimModel.find({ category }).populate('user');
    res.status(200).json({ claim });
  } catch (error) {
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

    const comment = new CommentModel({
      user: req.user._id,
      claim: req.params.id,
      comments: req.body.comments,
    });

    await comment.save();

    const populatedComment = await CommentModel.findById(comment._id).populate('user', 'username');

    if (claim.user.toString() !== req.user._id.toString()) {
      await NotificationModel.create({
        user: claim.user,
        message: `New comment on your claim ${claim.title}`,
      });
    }

    res.status(200).json({ comment: populatedComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({ claim: req.params.id })
      .populate('user', 'username');
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment || comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getMyComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({ user: req.user._id })
      .select('comments image video createdAt') 
      .sort({ createdAt: -1 }); 
    
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getMyBookmarks = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: 'bookmarks',
      model: 'Claim'
    });
    res.status(200).json(user.bookmarks || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.bookmarkClaim = async (req, res) => {
  try {
    const claimId = req.params.id;
    const userId = req.user._id;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.bookmarks.includes(claimId)) {
      return res.status(400).json({ message: "Already bookmarked" });
    }

    user.bookmarks.push(claimId);
    await user.save();

    res.status(200).json({ message: "Claim bookmarked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.unbookmarkClaim = async (req, res) => {
  try {
    const claimId = req.params.id;
    const userId = req.user._id;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.bookmarks.indexOf(claimId);
    if (index === -1) {
      return res.status(400).json({ message: "Claim not bookmarked" });
    }

    user.bookmarks.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "Claim unbookmarked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

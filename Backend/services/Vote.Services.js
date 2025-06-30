const VoteModel = require('../models/Vote.Model');
const ClaimModel = require('../models/Claim.Model');

module.exports.voteClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const voteType = req.body.vote; 
    const userId = req.user._id; 

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type." });
    }

    const existingVote = await VoteModel.findOne({ user: userId, claim: claimId });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await VoteModel.findByIdAndDelete(existingVote._id);
        return res.status(200).json({ message: "Vote removed" });
      }

      existingVote.voteType = voteType;
      await existingVote.save();
      return res.status(200).json({ message: "Vote updated", vote: existingVote });
    }

    const newVote = await VoteModel.create({
      user: userId,
      claim: claimId,
      voteType
    });

    res.status(201).json({ message: "Vote added", vote: newVote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
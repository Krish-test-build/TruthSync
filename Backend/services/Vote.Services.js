const VoteModel = require('../models/Vote.Model');
const ClaimModel = require('../models/Claim.Model');

module.exports.voteClaim = async (claimId, userId, voteType) => {
  if (!['upvote', 'downvote'].includes(voteType)) {
    throw new Error('Invalid vote');
  }

  const existingVote = await VoteModel.findOne({ user: userId, claim: claimId });

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      await VoteModel.findByIdAndDelete(existingVote._id);
      return { message: "Vote removed" };
    } 

    existingVote.voteType = voteType;
    await existingVote.save();
    return { message: "Vote updated", vote: existingVote };
  }

  const newVote = await VoteModel.create({ user: userId, claim: claimId, voteType });
  return { message: "Vote added", vote: newVote };
};


  
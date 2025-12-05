const VoteModel = require('../models/Vote.Model');
const ClaimModel = require('../models/Claim.Model');

module.exports.voteClaim = async (claimId, userId, voteType) => {
  if (!['upvote', 'downvote'].includes(voteType)) {
    throw new Error('Invalid vote');
  }

  const existingVote = await VoteModel.findOne({ user: userId, claim: claimId });
  const claim = await ClaimModel.findById(claimId);
  claim.upvote = Number(claim.upvote ?? 0);
  claim.downvote = Number(claim.downvote ?? 0);




  if (existingVote) {
    if (existingVote.voteType === voteType) {
      await VoteModel.findByIdAndDelete(existingVote._id);
      if (voteType === 'upvote'  && claim.upvote!==0) claim.upvote--;
      else if ( claim.downvote!==0) claim.downvote--;
      await claim.save();
      return { message: "Vote removed", upvote: claim.upvote, downvote: claim.downvote };
    } else {
      if (existingVote.voteType === 'upvote' && claim.upvote!==0) claim.upvote--;
      else if ( claim.downvote!==0) claim.downvote--;
      if (voteType === 'upvote') claim.upvote++;
      else claim.downvote++;
      existingVote.voteType = voteType;
      await existingVote.save();
      await claim.save();
      return { message: "Vote updated", upvote: claim.upvote, downvote: claim.downvote };
    }
  }

  const newVote = await VoteModel.create({ user: userId, claim: claimId, voteType });
  if (voteType === 'upvote') claim.upvote++;
  else claim.downvote++;
  await claim.save();
  return { message: "Vote added", upvote: claim.upvote, downvote: claim.downvote };
};
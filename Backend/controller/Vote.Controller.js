const voteService = require('../services/Vote.Services');


module.exports.voteClaim = async (req, res) => {
  try {
    const { id: claimId } = req.params;
    const voteType = req.body.vote;
    const userId = req.user._id;

    const result = await voteService.voteClaim(claimId, userId, voteType);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const voteService = require('../services/Vote.Services');


module.exports.voteClaim = async (req, res) => {
    try {
        const vote = await voteService.voteClaim(req.params.id, req.user.id);
        res.status(200).json(vote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

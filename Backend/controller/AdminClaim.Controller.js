const { validationResult } = require('express-validator');
const ClaimModel = require('../models/Claim.Model');


module.exports.moderateClaim = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { decision } = req.body;

    const claim = await ClaimModel.findById(id).populate('user');

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status !== 'Pending') {
      return res.status(400).json({ message: "Claim is not Pending" });
    }

    if (!['Approved', 'Rejected'].includes(decision)) {
      return res.status(400).json({ message: "Decision must be 'Approved' or 'Rejected'" });
    }

    claim.status = decision;
    await claim.save();

    if (decision === 'Rejected') {
      return res.status(200).json({
        message: "Claim rejected and saved.",
        userMessage: `${claim.user.username}, your claim was rejected after being flagged for inappropriate content.`
      });
    }

    res.status(200).json({ message: `Claim has been ${decision}` });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getPendingClaims= async (req,res) => {
    try {
        const claim = await ClaimModel.find({status:'Pending'}).sort({ createdAt: -1 });
        res.status(200).json(claim);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}
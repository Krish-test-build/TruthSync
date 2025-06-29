const claimService = require('../services/Claim.Services');
const { validationResult } = require('express-validator');
const {defaultImage} = require('../config/Default.config');


module.exports.createClaim = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
     try {
    const claimData = {
      ...req.body,
      image: req.file ? req.file.filename : defaultImage,
      user: req.user._id,
      title: req.body.title?.trim(),
      description: req.body.description?.trim(),

    };

    const claim = await claimService.newClaim(claimData);

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

module.exports.deleteClaim = async(req,res) =>{
    try{
        const claim = await claimService.getClaimById(req.params.id);

        if (!claim) {
        return res.status(404).json({ message: 'Claim not found' });
        }
        if(claim.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await claimService.deleteClaim(req.params.id);
        res.status(200).json({ message: 'Claim deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
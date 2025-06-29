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
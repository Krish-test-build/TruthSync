const claimService = require('../services/Claim.Services');
const { validationResult } = require('express-validator');
const {defaultImage} = require('../config/Default.config');
const moderationServices = require('../services/Moderation.Services');
const ClaimModel = require('../models/Claim.Model');
const CommentModel = require('../models/Comment.Model');


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
      image: req.file ? req.file.filename : defaultImage,
      user: req.user._id,
      status: moderationResult.isFlagged ? 'Pending' : 'Approved'
    };

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

module.exports.sortClaims = async (req,res) => {
    try{
        const {query} = req.query
        let claim;
        if(!query){
            claim = await ClaimModel.find({}).populate('user');
            res.status(200).json({claim:claim})
        }
        if(query==='Most Recent'){
            claim = await ClaimModel.find({}).sort({createdAt: -1}).populate('user');
        }else if(query==='Most Popular'){
            claim = await ClaimModel.find({}).sort({votes: -1}).populate('user');
        }else if(query==='Categories'){
            claim =await ClaimModel.find({}).sort({category: 1}).populate('user');
        }else{
            res.status(400).json({message: 'Invalid query'})
        }
        res.status(200).json({message: 'Sorted successfully', claim: claim})
    }catch(error){
        res.status(500).json({error: error.message})
    }
}
module.exports.filterClaims = async (req,res) => {
    const {category} = req.params
    try{
        const claim = await ClaimModel.find({category: category}).populate('user');
        res.status(200).json({claim:claim})
    }catch(error){
        res.status(500).json({error: error.message})
    }
    
}

module.exports.commentClaim = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
      const claim = await CommentModel.findById(req.params.id);
        if (!claim) {
          return res.status(404).json({ message: 'Claim not found' });
        }
        const comment = new CommentModel({ user: req.user._id, claim: req.params.id, comments: req.body.comments });
        await comment.save();
        res.status(200).json({ message: 'Comment added successfully' });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    
}
module.exports.getComments = async (req,res) => {
    try{
      const comments = await CommentModel.find({ claim: req.params.id }).populate('user', 'username'); 
      res.status(200).json({ comments });

    }catch(error){
      res.status(500).json({error: error.message})
    }
    
}
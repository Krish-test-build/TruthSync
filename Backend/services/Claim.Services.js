const claimModel = require('../models/Claim.Model');
const {defaultImage} = require('../config/Default.config')
const moderationServices = require('./Moderation.Services');


module.exports.newClaim = async (data) => {
    const newClaim = await claimModel.create({
    title: data.title,
    description: data.description,
    category: data.category,
    image: data.image || defaultImage,           
    user: data.user,
    isAnonymous: data.isAnonymous || false,
    status: data.status || 'Approved',
    date: new Date()
  });

  return newClaim;
};

module.exports.getClaim = async (id) => {
  const claim = await claimModel.find({ user: id }).populate('user');
  return claim;
};

module.exports.getClaimById = async (id) => {
  const claim = await claimModel.findById(id).populate('user');
  return claim;
};
module.exports.updateClaim = async (id, data) => {
  const claim = await claimModel.findByIdAndUpdate(id, data, { new: true });
  return claim;
};
module.exports.deleteClaim = async (id) => {
  const claim = await claimModel.findByIdAndDelete(id);
  return claim;
};
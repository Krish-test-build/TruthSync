const claimModel = require('../models/Claim.Model');
const {defaultImage} = require('../config/Default.config')


module.exports.newClaim = async (data) => {
    const newClaim = await claimModel.create({
    title: data.title,
    description: data.description,
    category: data.category,
    image: data.image || defaultImage,           
    user: data.user,
    isAnonymous: data.isAnonymous || false,
    status: 'Pending',
    date: new Date()
  });

  return newClaim;
};

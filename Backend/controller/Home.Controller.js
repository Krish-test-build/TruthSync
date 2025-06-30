const ClaimModel = require('../models/Claim.Model');



module.exports.showHome = async (req,res)=>{
    try{
        const claims = await ClaimModel.find({status:'Approved'}).populate('user')
    res.status(200).json(claims)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}
module.exports.showCategories =async (req,res)=>{
    try{
        const categories = await ClaimModel.find({}).distinct('category');
        res.status(200).json(categories)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}
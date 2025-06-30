const ClaimModel = require('../models/Claim.Model.js');

module.exports.searchClaims =async (req,res) => {
    try{
        const {q} = req.query;
        const search = await ClaimModel.find({
            title: {$regex: q, $options: 'i'}
        }).sort({createdAt: -1});
        res.status(200).json(search);

    }catch(error){
        res.status(500).json({error: error.message})
    }
}
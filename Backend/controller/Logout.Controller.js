const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/BlackListToken.model');

module.exports.logoutUser = async (req, res) => {
     res.clearCookie('token')
    const token =req.cookies.token|| (req.headers.authorization?.split(' ')[1])
    if(token){
        await blacklistTokenModel.create({token})
    }

    res.status(200).json({message:"Logged out"})

};  
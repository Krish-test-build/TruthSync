const jwt = require('jsonwebtoken');
const userModel = require('../models/SignUp.Model');
const BlackListTokenSchema = require('../models/BlackListToken.model');

module.exports.authUser= async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlackListed = await BlackListTokenSchema.findOne({ token });

        if (isBlackListed) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports.authAdmin= async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlackListed = await BlackListTokenSchema.findOne({ token });

        if (isBlackListed) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

       

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
         if (!user|| user.username !== 'krish') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const UserModel = require("../models/SignUp.Model");
  const {defaultImage} = require('../config/Default.config');



module.exports.getProfile = async (req, res) => {
  try {
    const { _id, firstName, lastName, username, email, createdAt, image } = req.user;
    res.status(200).json({ _id, firstName, lastName,image: image || defaultImage, username, email, createdAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.adminProfile = async (req, res) => {
  try {
    const { _id, firstName, lastName, username, email, createdAt } = req.user;
    if(username!=='krish'){
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ _id, firstName, lastName, username, email, createdAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports.updateProfile = async (req, res) => {
  const { firstName, lastName, username, email } = req.body;
    try{
        const isUserExist= await UserModel.findOne({
            $or: [{ username }, { email }],
            _id: { $ne: req.user._id },
            });
        if (isUserExist) {
            return res.status(400).json({ message: "Username or email already exists" });
        }


        const updateData = {
            firstName,
            lastName,
            username,
            email,
        }
        if (req.file) {
          updateData.image = `/uploads/${req.file.filename}`;
        }

        const updated =   await UserModel.findByIdAndUpdate(req.user._id,updateData,{new:true});

        res.status(200).json(updated);
    }catch(error){
    res.status(500).json({ error: error.message });
}
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
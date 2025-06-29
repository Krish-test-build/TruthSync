const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {defaultImage} = require('../config/Default.config')


const SignUpModel = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique:true,

  },
  email: { 
    type: String,
    required: true,
    unique: true,

  },
  password: {
    type: String, 
    required: true,
    select:false,
    
    },
  image: {
  type: String,
  default: defaultImage
}


},{timestamps: true});

SignUpModel.statics.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

SignUpModel.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password);
};


SignUpModel.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
};
  

module.exports = mongoose.model('SignUp', SignUpModel);
const bcrypt = require('bcrypt');
const SignUpModel = require('../models/SignUp.Model');
const {validationResult} = require('express-validator')


module.exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await SignUpModel.findOne({ username }).select('+password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

    const isAdmin = user.username === 'krish'; 
    const token = user.generateToken(); 

    res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24
  });

    if(!isAdmin) return res.status(200).json({ message: 'Login successful' });
    else return res.status(200).json({ message: 'Login successful Admin', isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



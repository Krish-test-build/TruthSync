const express = require('express');
const router = express.Router();
const SignUpServices = require('../services/SignUp.Services');
const SignUpModel = require('../models/SignUp.Model');
const {validationResult}=require('express-validator');
const {defaultImage} = require('../config/Default.config');

module.exports.signUpUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const isUserExist = await SignUpModel.findOne({ email: req.body.email });
        if (isUserExist) {
            throw new Error('User already exist');
        }
        if (req.body.username === 'krish') {
        throw new Error('Username Reserved');
        }

        const hashPassword = await SignUpModel.hashPassword(req.body.password);
        req.body.password = hashPassword;

        const { firstName, lastName, username, email, password } = req.body;
        const image = req.file ? req.file.filename : defaultImage;
        const user = await SignUpServices.signup({ firstName, lastName, username, email, password:hashPassword,image });

        res.status(201).json({ user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


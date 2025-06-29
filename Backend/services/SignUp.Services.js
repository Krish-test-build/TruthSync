const SignUpModel=require('../models/SignUp.Model');
const {defaultImage} = require('../config/Default.config')




module.exports.signup= async({firstName,lastName,username,email,password})=>{
    if(!firstName || !lastName || !username || !email || !password){
        throw new Error(`Please fill in ${!firstName ? 'firstName' : !lastName ? 'lastName' : !username ? 'username' : !email ? 'email' : 'password'} field`);
    }
    const user=await SignUpModel.create(
        {firstName,
        lastName,
        username,
        email,
        password,
        image: image || defaultImage,
    }
);
    return user
}
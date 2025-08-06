const mongoose = require('mongoose');
const {defaultImage} = require('../config/Default.config')


const ClaimSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum:['Pending','Approved','Rejected'],
        default: 'Approved'
    },
    category:{
        type: String,
        enum:['Politics','Health','Education','Entertainment','Science and Tech','Finance','Sports','Miscellaneous'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SignUp', 
    required: true
  },
    isAnonymous:{
        type: Boolean,
        default: false
    },
    image: {
    type: String,
    default: null
    }


},{timestamps:true});


module.exports = mongoose.model('Claim', ClaimSchema);
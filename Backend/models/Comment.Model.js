const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SignUp'
    },
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Claim'
    },
    comments: {
        type: String,
    },
    image: {
        type: String, 
    },
    video: {
        type: String, 
    }
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);

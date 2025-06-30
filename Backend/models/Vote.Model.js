const mongoose = require('mongoose');


const VoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SignUp',
        required: true
    },
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Claim',
        required: true
    },
    voteType: {
        type: String,
        enum: ['upvote', 'downvote'],
        required: true
    }
},{timestamps: true });
VoteSchema.index({ user: 1, claim: 1 }, { unique: true });


module.exports = mongoose.model('Vote', VoteSchema);
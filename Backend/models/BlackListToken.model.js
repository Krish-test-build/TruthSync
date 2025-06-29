const mongoose = require('mongoose');

const BlackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    BlacklistedAt: {
        type: Date,
        default: Date.now,
        expires:60*60*24
    }
});

module.exports = mongoose.model('BlackListToken', BlackListTokenSchema);
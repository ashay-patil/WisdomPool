const mongoose = require('mongoose');
const experience = require('./experience');

const likesSchema = new mongoose.Schema({
    likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
    },
    experience : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Experience'
    },
    liked : {
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('Likes', likesSchema);
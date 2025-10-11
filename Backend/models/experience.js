const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'selected', 'rejected', 'ghosted'],
        default: 'pending'
    },
    company:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    rounds:{
        type: Number,
        required: true
    },
    interviewDate:{
        type: Date,
        required: true
    },
});

module.exports = mongoose.model('Experience', experienceSchema);
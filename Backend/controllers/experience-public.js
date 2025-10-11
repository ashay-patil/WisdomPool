const Experience = require('../models/experience');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../custom-errors');

const getExperience = async (req, res) => {
    const id = req.params.id;
    const experience = await Experience.findById(id).populate('user', 'name email');
    if (!experience) {
        throw new NotFoundError('Experience not found');
    }
    res.status(StatusCodes.OK).json({ success: true, experience });
}

const getAllExperiences = async (req, res) => {
    const experiences = await Experience.find().populate('user', 'name email');
    res.status(StatusCodes.OK).json({ success: true, experiences });
}

module.exports = { getExperience, getAllExperiences };
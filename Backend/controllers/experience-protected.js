const Experience = require('../models/experience');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, UnauthorizedError } = require('../custom-errors');

const createExperience = async (req, res) => {
    const { company, position, role, description, rounds, interviewDate } = req.body;
    const experience = await Experience.create({ company, position, role, description, rounds, interviewDate, user: req.user.id });
    res.status(StatusCodes.CREATED).json({ success: true, experience });
};

const updateExperience = async (req, res) => {
    const { id } = req.params;

    const experience = await Experience.findById(id);
    if (!experience) {
        throw new NotFoundError('Experience not found');
    }

    if (experience.user.toString() !== req.user.id) {
        throw new UnauthorizedError('Not authorized to update this experience');
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ success: true, experience: updatedExperience });
};


const deleteExperience = async (req, res) => {
    const { id } = req.params;

    const experience = await Experience.findById(id);
    if (!experience) {
        throw new NotFoundError('Experience not found');
    }

    if (experience.user.toString() !== req.user.id) {
        throw new UnauthorizedError('Not authorized to delete this experience');
    }

    await experience.deleteOne();

    res.status(StatusCodes.OK).json({ success: true, message: 'Experience deleted successfully' });
};


const getAllMyExperiences = async (req, res) => {
    const experiences = await Experience.find({ user: req.user.id })
        .populate('user', 'name email');

    res.status(StatusCodes.OK).json({
        success: true,
        count: experiences.length,
        experiences
    });
};

module.exports = {createExperience, updateExperience, deleteExperience, getAllMyExperiences}
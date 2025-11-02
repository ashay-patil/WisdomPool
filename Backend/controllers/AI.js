const { BadRequest } = require('../custom-errors');
const aiService = require('../services/aiService'); 
const {StatusCodes} = require('http-status-codes');
const Experience = require('../models/experience');
const mongoose = require('mongoose');
const aiCareerMentor = require('../services/aiCareerMentor')
const geminiAi = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: true, msg: 'Experience id is required' });
  }

  try {
    const experience = await Experience.findById(id).populate('user', 'name email');
    if (!experience) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: true, msg: 'Experience not found' });
    }

    const prompt = `
Company: ${experience.company}
Position: ${experience.position}
Role: ${experience.role}
Description: ${experience.description}
Number of Interview Rounds: ${experience.rounds}
Interview Date: ${experience.interviewDate ? experience.interviewDate.toISOString().split('T')[0] : 'N/A'}
Status: ${experience.status}
`;

    const response = await aiService(prompt);
    res.status(StatusCodes.OK).send(response);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: true, msg: 'Internal Server Error' });
  }
}

const careerMentor = async (req, res) => {
  try {
    const { company, position, role, status } = req.query;

    if (!company || !position || !role || !status) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, msg: "All fields are required" });
    }

    const filter =
      status === "all"
        ? { company, position, role }
        : { company, position, role, status };

    const projection = {
      company: 1,
      position: 1,
      role: 1,
      description: 1,
      rounds: 1,
      interviewDate: 1,
      status: 1,
    };

    const experiences = await Experience.find(filter, projection);

    if (!experiences || experiences.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: true, msg: "No experiences found for given criteria" });
    }

    const response = await aiCareerMentor(experiences);

    res
      .status(StatusCodes.OK)
      .send(response);

  } catch (error) {
    console.error("Career Mentor Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: true, msg: "Failed to get career mentor response" });
  }
};

module.exports = { geminiAi, careerMentor };
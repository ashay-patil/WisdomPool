const { BadRequest } = require('../custom-errors');
const aiService = require('../services/aiService'); 
const {StatusCodes} = require('http-status-codes');
const Experience = require('../models/experience');
const mongoose = require('mongoose');

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
Candidate Name: ${experience.user.name || ''}
Candidate Email: ${experience.user.email || ''}
`;

    const response = await aiService(prompt);
    res.status(StatusCodes.OK).send(response);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: true, msg: 'Internal Server Error' });
  }
}

module.exports = { geminiAi };
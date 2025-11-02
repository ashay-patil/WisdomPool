const express = require('express');
const router = express.Router();
const {careerMentor} = require('../controllers/AI');
router.get('/career-mentor', careerMentor);

module.exports = router;
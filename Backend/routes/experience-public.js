const express = require('express');
const router = express.Router();
const {getExperience, getAllExperiences} = require('../controllers/experience-public');

router.get('/get-all-experiences', getAllExperiences);
router.get('/get-single-experience/:id', getExperience );

module.exports = router;
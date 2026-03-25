const express = require('express');
const router = express.Router();
const {createExperience, updateExperience, deleteExperience, getAllMyExperiences, toggleLike, getLikeStatus} = require('../controllers/experience-protected');
const authorize = require('../middlewares/authorize');


router.use(authorize);
router.post('/create-experience', createExperience);
router.put('/update-experience/:id', updateExperience );
router.get('/get-all-myExperiences', getAllMyExperiences);
router.delete('/delete-experience/:id',deleteExperience);
router.get('/toggle-like/:id', toggleLike);
router.get('/get-like-status/:id', getLikeStatus);
module.exports = router;
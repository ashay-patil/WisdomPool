const express = require('express');
const router = express.Router();
const {geminiAi} = require('../controllers/AI');
router.get('/:id', geminiAi);

module.exports = router;
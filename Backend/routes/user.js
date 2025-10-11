const express = require('express');
const router = express.Router();
const {register, login, getUser} = require('../controllers/user');

const authorize = require('../middlewares/authorize');

router.post('/register',register);
router.post('/login', login);
router.get('/get-user', authorize, getUser);

module.exports = router;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { UnauthorizedError, BadRequest } = require('../custom-errors');

const register = async (req, res) => {
    console.log("Reached register controller");
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        throw new BadRequest('User exists already');
    }
    const hashpass = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashpass });
    res.status(StatusCodes.CREATED).json({ success: true, msg: `User created successfully` });
}


const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthorizedError('User not registered');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new UnauthorizedError('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id, username: user.name, email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(StatusCodes.OK).json({ success: true, token });
}

const getUser = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(StatusCodes.OK).json({ success: true, user });
}

module.exports = { register, login, getUser };
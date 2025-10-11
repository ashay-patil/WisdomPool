const jwt = require('jsonwebtoken');
const {UnauthorizedError} = require('../custom-errors')

const authorize = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedError('You need to login first');
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedError('You need to login first');
    }
};

module.exports = authorize;
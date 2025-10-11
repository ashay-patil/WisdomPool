const {CustomAPIError}= require('../custom-errors');
const {StatusCodes} = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ error : true, msg: err.message })
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : true, msg :"Internal Server Error"})
}

module.exports = errorHandlerMiddleware;
const mongoose = require('mongoose');
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = (url) => {
  return mongoose.connect(url);
}
module.exports = connectDB;
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  id: {
    type: String
  },
  type: {
    type: String
  },
  text: {
    type: String
  }
});
const Users = mongoose.model('users', userSchema);

module.exports = Users
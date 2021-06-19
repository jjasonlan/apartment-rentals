const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'client', 'realtor'],
  },
});

const User = mongoose.model('Users', userSchema);
module.exports.User = User;

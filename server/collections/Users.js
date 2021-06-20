const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true, 
    unique: true
  },
  name: {
    type: String,
    require: true, 
  },
  password: {
    type: String,
    require: true, 
  },
  role: {
    type: String,
    enum: ['admin', 'client', 'realtor'],
    require: true,
  },
});

const User = mongoose.model('Users', userSchema);
module.exports = User;

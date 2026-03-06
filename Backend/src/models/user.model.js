const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'Username already taken'],
    required: [true, 'Username is required'],
    trim: true,
    minlength: [4, 'Username must be at least 4 characters'],
    maxlength: [12, 'Username cannot exceed 12 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Account is already exist with this email'],
    // lowercase: true,
    trim: true,
    // match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [4, 'Password must be at least 4 characters']
  }
}, {
  timestamps: true
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
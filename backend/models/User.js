const mongoose = require('mongoose');

/**
 * User schema for authentication (both regular users and mechanics).
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },          // bcrypt hash
  role: { type: String, enum: ['user', 'mechanic'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

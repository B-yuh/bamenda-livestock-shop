const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  location: String,
  password: String, // In production, this should be hashed!
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
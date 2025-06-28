const mongoose = require('mongoose');

const vetQuestionSchema = new mongoose.Schema({
  name: String,
  phone: String,
  question: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VetQuestion', vetQuestionSchema);
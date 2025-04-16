// models/QuizResult.js
const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;

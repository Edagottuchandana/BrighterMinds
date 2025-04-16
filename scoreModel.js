const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  gameType: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  ageGroup: { 
    type: String,
    required: true, // Ensure that ageGroup is required
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Score = mongoose.model('Score', scoreSchema, 'scores');

module.exports = Score;

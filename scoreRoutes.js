// routes/scoreRoutes.js
const express = require('express');
const Score = require('../models/scoreModel'); // Import the Score model

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, gameType, score, timestamp, ageGroup } = req.body;
  
  const newScore = new Score({ userId, gameType, score, timestamp, ageGroup });

  try {
    await newScore.save();
    res.status(200).json({ message: 'Score saved successfully', data: newScore });
  } catch (error) {
    res.status(500).json({ message: 'Error saving score', error });
  }
});

router.get('/all-scores', async (req, res) => {
  console.log("Fetching all scores...");
  try {
    const scores = await Score.find();
    res.status(200).json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ error: 'Error fetching scores', message: error.message });
  }
});

module.exports = router;

const express = require('express');
const QuizResult = require('../models/QuizResult');
const router = express.Router();

// POST Route to store quiz results
router.post('/submit', async (req, res) => {
  const { userName, category, ageGroup, score } = req.body;

  if (!userName || !category || !ageGroup || score === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newQuizResult = new QuizResult({
      userName,
      category,
      ageGroup,
      score
    });

    await newQuizResult.save();
    res.status(201).json({ message: 'Score submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving score', error: error.message });
  }
});

// Get quiz results
router.get("/results", async (req, res) => {
  try {
    // Fetch all quiz results from the database
    const results = await QuizResult.find(); // Correct the model name here to match your Mongoose model
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching quiz results." });
  }
});

module.exports = router;

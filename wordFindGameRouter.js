const express = require("express");
const WordFindGame = require("../models/wordFindGameModel");

const router = express.Router();

// Mock words data for different age groups
const words = {
  "4-6": ["CAT", "DOG", "BAT"],
  "7-9": ["GIRAFFE", "ELEPHANT", "TIGER"],
  "10-12": ["PYTHON", "JAVASCRIPT", "REACT"],
};

// Save or update user progress
router.post("/save-progress", async (req, res) => {
  const { userId, ageGroup, wordsFound, attempts, gameTime, completedGrids, gameName } = req.body;

  try {
    const existingProgress = await WordFindGame.findOne({ userId, ageGroup });

    if (existingProgress) {
      // Update existing progress
      existingProgress.gameName = gameName || existingProgress.gameName;
      existingProgress.wordsFound = [
        ...new Set([...existingProgress.wordsFound, ...wordsFound]),
      ]; // Avoid duplicate words
      existingProgress.attempts += attempts;
      existingProgress.gameTime = gameTime;
      existingProgress.completedGrids += completedGrids;

      await existingProgress.save();
      return res.status(200).json({
        message: "Progress updated successfully!",
        data: existingProgress,
      });
    } else {
      // Create new progress record
      const newProgress = new WordFindGame({
        gameName,
        userId,
        ageGroup,
        wordsFound,
        attempts,
        gameTime,
        completedGrids,
      });
      await newProgress.save();
      return res
        .status(201)
        .json({ message: "Progress saved successfully!", data: newProgress });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving progress.", message: error.message });
  }
});

// Get all progress
router.get("/all-progress", async (req, res) => {
  try {
    const progressData = await WordFindGame.find();
    res.status(200).json(progressData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching progress data", message: error.message });
  }
});

// Get words for an age group
router.get("/words/:ageGroup", (req, res) => {
  const { ageGroup } = req.params;
  if (words[ageGroup]) {
    res.status(200).json(words[ageGroup]);
  } else {
    res.status(404).json({ error: "No words found for this age group" });
  }
});

module.exports = router;

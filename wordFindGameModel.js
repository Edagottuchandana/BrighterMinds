const mongoose = require("mongoose");

// WordFindGame Schema
const wordFindGameSchema = new mongoose.Schema(
  {
    gameName: { type: String, required: true, default: "Word Find Puzzle" },
    userId: { type: String, required: true },
    ageGroup: { type: String, required: true },
    wordsFound: { type: [String], default: [] },
    attempts: { type: Number, default: 0 },
    gameTime: { type: String, default: "0:00" },
    completedGrids: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WordFindGame", wordFindGameSchema, "wordfindgames");

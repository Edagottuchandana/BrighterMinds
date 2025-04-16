require('dotenv').config();  // Ensure this is at the very top

console.log("JWT_SECRET:", process.env.JWT_SECRET); // This should print your secret key

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const scoreRoutes = require('./routes/scoreRoutes');
const wordFindGameRouter = require('./routes/wordFindGameRouter');
const quizRoutes = require("./routes/quizRoutes");



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());



// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/api", authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/wordfind', wordFindGameRouter);
app.use("/api/quiz", quizRoutes);




// Server Start
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

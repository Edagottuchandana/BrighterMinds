const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Debug log to check if JWT_SECRET is being set correctly
console.log("JWT_SECRET:", JWT_SECRET);

// Register Route
router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword, gender, parentalInfo } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      gender,
      parentalInfo,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      // Generate JWT
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Generate a password reset token that expires in 15 minutes
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // You can change this to another email service if needed
      auth: {
        user: process.env.EMAIL_USER,  // Add your email address in the .env file
        pass: process.env.EMAIL_PASS   // Add your email password in the .env file
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender email address
      to: email,  // Recipient email address
      subject: 'Password Reset Request',
      text: `Click the link below to reset your password:\n\n${resetLink}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ success: true, message: "Password reset link sent to email." });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;

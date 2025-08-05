const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const authenticateUser = require("../middlewares/user-middleware");
require("dotenv").config({ path: "local.env" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email, and Password is required to register a user",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "300m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_REFRESH
    );

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/quiz-attempts", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const attempts = await User.findById(userId).populate("quiz_attempts");
    res.status(200).json({ attempts: attempts.quiz_attempts });
  } catch (err) {
    console.error("Error fetching quiz attempts:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

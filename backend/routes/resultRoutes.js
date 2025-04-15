const express = require("express");
const router = express.Router();
const Result = require("../models/Result");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Fetch all past results for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

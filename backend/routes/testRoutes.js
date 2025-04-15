const express = require("express");
const router = express.Router();
const Test = require("../models/Test");
const authMiddleware = require("../middleware/authMiddleware");
const Result = require("../models/Result"); 



// ✅ Fetch all tests
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Create a new test (for adding mock tests)
router.post("/", async (req, res) => {
  try {
    const newTest = new Test(req.body);
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ message: "Invalid Data" });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});




// ✅ Save results when submitting a test
router.post("/:id/submit", authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let score = 0;
    let results = [];

    test.questions.forEach((q) => {
      const isCorrect = answers[q._id] === q.correctAnswer;
      if (isCorrect) score++;
      results.push({
        question: q.questionText,
        selectedAnswer: answers[q._id] || "No Answer",
        correctAnswer: q.correctAnswer,
        isCorrect,
      });
    });

    const newResult = new Result({
      userId: req.user.id,
      testId: test._id,
      testTitle: test.title,
      score,
      totalQuestions: test.questions.length,
      results,
    });
    await newResult.save();

    res.json({
      testTitle: test.title,
      score,
      totalQuestions: test.questions.length,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing test submission" });
  }
});




module.exports = router;

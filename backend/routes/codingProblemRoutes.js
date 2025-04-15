const express = require('express');
const router = express.Router();
const CodingProblem = require('../models/CodingProblem');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');
const User = require('../models/User');

// Language ID mapping for Judge0 API
const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
};

// Helper function to run code against test cases
const runTestCases = async (code, language, testCases) => {
  const results = [];
  const languageId = LANGUAGE_IDS[language];

  for (const testCase of testCases) {
    try {
      const submitResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
        source_code: code,
        language_id: languageId,
        stdin: testCase.input
      }, {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });

      const { token } = submitResponse.data;
      let resultResponse;
      let attempts = 0;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });
        attempts++;
      } while (resultResponse.data.status.id <= 2 && attempts < 10);

      const output = resultResponse.data.stdout?.trim() || '';
      const error = resultResponse.data.stderr || resultResponse.data.compile_output;

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: output,
        passed: output === testCase.expectedOutput,
        error: error || null,
        hidden: testCase.isHidden,
        time: resultResponse.data.time,
        memory: resultResponse.data.memory
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        error: 'Execution error: ' + error.message,
        passed: false,
        hidden: testCase.isHidden
      });
    }
  }

  return results;
}

// Get all coding problems
router.get('/', authMiddleware, async (req, res) => {
  try {
    const problems = await CodingProblem.find().select('-testCases');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific problem
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    const safeResponse = {
      ...problem.toObject(),
      testCases: problem.testCases.filter(tc => !tc.isHidden)
    };
    
    res.json(safeResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Test code against sample test cases
router.post('/:id/test', authMiddleware, async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const { code, language } = req.body;
    const sampleTestCases = problem.testCases.filter(tc => !tc.isHidden);
    
    const results = await runTestCases(code, language, sampleTestCases);
    const success = results.every(r => r.passed);

    res.json({
      success,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit solution for evaluation
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const { code, language } = req.body;
    const results = await runTestCases(code, language, problem.testCases);
    const success = results.every(r => r.passed);

    if (success) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { solvedProblems: problem._id },
        $push: {
          codeSubmissions: {
            problemId: problem._id,
            code,
            language
          }
        }
      });
    }

    res.json({
      success,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get submitted code for a solved problem
router.get('/:id/submission', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const submission = user.codeSubmissions.find(
      sub => sub.problemId.toString() === req.params.id
    );

    if (!submission) {
      return res.status(404).json({ message: 'No submission found for this problem' });
    }

    res.json({
      code: submission.code,
      language: submission.language,
      submittedAt: submission.submittedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new coding problem (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const problem = new CodingProblem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

module.exports = router;
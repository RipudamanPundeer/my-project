const express = require('express');
const router = express.Router();
const CodingProblem = require('../models/CodingProblem');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');

// Get all coding problems
router.get('/', authMiddleware, async (req, res) => {
  try {
    const problems = await CodingProblem.find().select('-testCases'); // Don't send hidden test cases
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
    
    // Only send sample test cases, not hidden ones
    const safeResponse = {
      ...problem.toObject(),
      testCases: problem.testCases.filter(tc => !tc.isHidden)
    };
    
    res.json(safeResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Submit solution for a problem
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await CodingProblem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const languageIds = {
      javascript: 63, // Node.js
      python: 71,    // Python 3
      java: 62       // Java
    };

    const languageId = languageIds[language];
    if (!languageId) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    let allTestsPassed = true;
    const results = [];

    // Test against all test cases (both sample and hidden)
    for (const testCase of problem.testCases) {
      try {
        // Submit to Judge0 API
        const submitResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
          source_code: code,
          language_id: languageId,
          stdin: testCase.input,
          expected_output: testCase.expectedOutput,
          cpu_time_limit: problem.timeLimit / 1000, // Convert to seconds
          memory_limit: problem.memoryLimit * 1024, // Convert to KB
        }, {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.RAPID_API_KEY
          }
        });

        const token = submitResponse.data.token;
        
        // Wait for results
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.RAPID_API_KEY
          }
        });

        const { status, stdout, stderr, compile_output, time, memory } = resultResponse.data;
        
        const testResult = {
          passed: status.id === 3, // Status 3 means Accepted
          status: status.description,
          input: testCase.isHidden ? 'Hidden' : testCase.input,
          expectedOutput: testCase.isHidden ? 'Hidden' : testCase.expectedOutput,
          actualOutput: stdout || stderr || compile_output,
          time,
          memory,
          hidden: testCase.isHidden
        };

        results.push(testResult);
        if (!testResult.passed) allTestsPassed = false;

      } catch (error) {
        console.error('Test case execution error:', error);
        results.push({
          passed: false,
          status: 'Runtime Error',
          error: error.message,
          hidden: testCase.isHidden
        });
        allTestsPassed = false;
      }
    }

    // Only show detailed results for sample test cases
    const safeResults = results.map(result => 
      result.hidden ? { ...result, input: 'Hidden', expectedOutput: 'Hidden' } : result
    );

    res.json({
      success: allTestsPassed,
      results: safeResults
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Error processing submission' });
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
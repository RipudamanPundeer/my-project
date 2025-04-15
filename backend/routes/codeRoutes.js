const express = require('express');
const router = express.Router();
const axios = require('axios');

// Language ID mapping for Judge0 API
const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
  cpp: 54,         // C++
  csharp: 51,      // C#
  ruby: 72,        // Ruby
  go: 60           // Go
};

router.post('/execute', async (req, res) => {
  const { code, language, input } = req.body;
  const languageId = LANGUAGE_IDS[language] || LANGUAGE_IDS.javascript;

  try {
    // Submit code to Judge0 API
    const submitResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
      source_code: code,
      language_id: languageId,
      stdin: input || '' // Pass user input to Judge0
    }, {
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPID_API_KEY
      }
    });

    const token = submitResponse.data.token;

    // Wait for a short time before getting results
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get submission results
    const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
      headers: {
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPID_API_KEY
      }
    });

    const { stdout, stderr, compile_output, status } = resultResponse.data;
    
    // Format the response
    let output = stdout || stderr || compile_output || 'No output';
    if (status.id >= 6) { // Error states in Judge0
      output = `Error: ${status.description}\n${stderr || compile_output}`;
    }

    res.json({ output });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ 
      error: 'Code execution failed',
      details: error.message 
    });
  }
});

module.exports = router;
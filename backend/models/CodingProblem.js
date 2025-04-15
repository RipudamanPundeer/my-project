const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  isHidden: { type: Boolean, default: false }
});

const templateCodeSchema = new mongoose.Schema({
  language: String,
  code: String
});

const codingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'],
    required: true 
  },
  timeLimit: { type: Number, default: 2000 }, // in milliseconds
  memoryLimit: { type: Number, default: 256 }, // in MB
  testCases: [testCaseSchema],
  templateCode: [templateCodeSchema],
  sampleTestCases: [testCaseSchema],
  constraints: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CodingProblem", codingProblemSchema);
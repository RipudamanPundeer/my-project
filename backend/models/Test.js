const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true, default: 30 }, // Duration in minutes
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
    },
  ],
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;

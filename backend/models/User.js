const mongoose = require('mongoose');

const codeSubmissionSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'company'], required: true, default: 'candidate' },
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' }],
  codeSubmissions: [codeSubmissionSchema],
  profile: {
    photo: {
      data: Buffer,
      contentType: String,
      filename: String
    },
    resume: {
      data: Buffer,
      contentType: String,
      filename: String
    },
    college: { type: String },
    degree: { type: String },
    graduationYear: { type: Number },
    skills: [String],
    bio: { type: String },
    phoneNumber: { type: String },
    linkedIn: { type: String },
    github: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

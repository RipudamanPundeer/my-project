const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String },
  resume: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'shortlisted', 'accepted', 'rejected'],
    default: 'pending'
  },
  notes: { type: String },
  testAssignment: {
    assignedTests: [{
      testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
      assignedAt: { type: Date, default: Date.now },
      completed: { type: Boolean, default: false },
      score: { type: Number },
      dueDate: { type: Date }
    }],
    codingProblems: [{
      problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' },
      assignedAt: { type: Date, default: Date.now },
      completed: { type: Boolean, default: false },
      score: { type: Number },
      dueDate: { type: Date }
    }]
  },
  placementStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'placed', 'not_placed'],
    default: 'pending'
  },
  placementDetails: {
    startDate: { type: Date },
    offerAccepted: { type: Boolean },
    offerDetails: { type: String },
    compensationPackage: {
      salary: { type: Number },
      currency: { type: String },
      period: { type: String }
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate fields
jobApplicationSchema.virtual('job', {
  ref: 'Job',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true
});

jobApplicationSchema.virtual('candidate', {
  ref: 'User',
  localField: 'candidateId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
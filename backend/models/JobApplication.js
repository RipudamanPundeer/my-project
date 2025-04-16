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
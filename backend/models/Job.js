const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  employmentType: { 
    type: String, 
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  experienceLevel: { 
    type: String, 
    required: true,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  responsibilities: { type: String, required: true },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
    period: { 
      type: String, 
      enum: ['yearly', 'monthly', 'hourly'],
      default: 'yearly'
    }
  },
  status: { 
    type: String, 
    enum: ['active', 'closed'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
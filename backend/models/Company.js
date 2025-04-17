const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  size: { type: String, enum: ['1-50', '51-200', '201-500', '501-1000', '1000+'] },
  location: { type: String, required: true },
  website: { type: String },
  description: { type: String },
  logo: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  socialMedia: {
    linkedIn: String,
    twitter: String
  },
  contactInfo: {
    email: { type: String },
    phone: String,
    address: String
  }
}, { timestamps: true });

// Add compound index for userId to ensure one company per user
companySchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Company', companySchema);
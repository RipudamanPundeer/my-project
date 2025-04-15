const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    photo: { type: String },
    resume: { type: String },
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

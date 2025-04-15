const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'photo') {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
    } else if (file.fieldname === 'resume') {
      if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
        return cb(new Error('Only PDF and Word documents are allowed!'), false);
      }
    }
    cb(null, true);
  }
});

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { college, degree, graduationYear, skills, bio, phoneNumber, linkedIn, github } = req.body;
    
    const profileFields = {
      'profile.college': college,
      'profile.degree': degree,
      'profile.graduationYear': graduationYear,
      'profile.skills': skills,
      'profile.bio': bio,
      'profile.phoneNumber': phoneNumber,
      'profile.linkedIn': linkedIn,
      'profile.github': github
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add or update profile photo
router.post('/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'profile.photo': {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add or update resume
router.post('/resume', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'profile.resume': {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Serve profile photo
router.get('/photo/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profile.photo || !user.profile.photo.data) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.set('Content-Type', user.profile.photo.contentType);
    res.send(user.profile.photo.data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Serve resume
router.get('/resume/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profile.resume || !user.profile.resume.data) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.set('Content-Type', user.profile.resume.contentType);
    res.set('Content-Disposition', `inline; filename="${user.profile.resume.filename}"`);
    res.send(user.profile.resume.data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Remove profile photo
router.delete('/photo', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $unset: { 'profile.photo': "" } }, // Use $unset to remove the field
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error("Error removing photo:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Remove resume
router.delete('/resume', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $unset: { 'profile.resume': "" } }, // Use $unset to remove the field
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error("Error removing resume:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const router = express.Router();

// Register User (Candidate or Company)
router.post('/register', async (req, res) => {
  const { name, email, password, role, companyDetails } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role: role || 'candidate'
    });
    await user.save();

    // If registering as company, create company profile
    if (role === 'company' && companyDetails) {
      const company = new Company({
        userId: user._id,
        companyName: companyDetails.companyName,
        industry: companyDetails.industry,
        size: companyDetails.size,
        location: companyDetails.location,
        website: companyDetails.website,
        description: companyDetails.description,
        contactInfo: {
          email: companyDetails.email || email,
          phone: companyDetails.phone,
          address: companyDetails.address
        }
      });
      await company.save();
    }

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // If company, fetch company details
    let companyDetails = null;
    if (user.role === 'company') {
      companyDetails = await Company.findOne({ userId: user._id });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        companyDetails 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

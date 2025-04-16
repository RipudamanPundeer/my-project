const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get company profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update company profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const {
      companyName,
      industry,
      size,
      location,
      website,
      description,
      socialMedia,
      contactInfo
    } = req.body;

    const company = await Company.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          companyName,
          industry,
          size,
          location,
          website,
          description,
          socialMedia,
          contactInfo
        }
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Upload company logo
router.post('/logo', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const company = await Company.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          'logo': {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname
          }
        }
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get company logo
router.get('/logo/:companyId', async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company || !company.logo || !company.logo.data) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    res.set('Content-Type', company.logo.contentType);
    res.send(company.logo.data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete company logo
router.delete('/logo', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { userId: req.user._id },
      { $unset: { logo: "" } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    res.json(company);
  } catch (error) {
    console.error("Error removing logo:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get company's jobs
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const jobs = await Job.find({ companyId: company._id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get company's applications
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // First get all jobs from this company
    const jobs = await Job.find({ companyId: company._id });
    const jobIds = jobs.map(job => job._id);

    // Then get all applications for these jobs
    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .populate('candidateId', 'name email profile')
      .populate({
        path: 'jobId',
        select: 'title department location employmentType'
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get company statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const totalJobs = await Job.countDocuments({ companyId: company._id });
    const activeJobs = await Job.countDocuments({ 
      companyId: company._id,
      status: 'active'
    });

    // Get all job IDs for this company
    const jobs = await Job.find({ companyId: company._id });
    const jobIds = jobs.map(job => job._id);

    const totalApplications = await JobApplication.countDocuments({
      jobId: { $in: jobIds }
    });

    const pendingReviews = await JobApplication.countDocuments({
      jobId: { $in: jobIds },
      status: 'pending'
    });

    res.json({
      totalJobs,
      activeJobs,
      totalApplications,
      pendingReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
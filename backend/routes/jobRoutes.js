const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Company = require('../models/Company');
const Test = require('../models/Test');
const CodingProblem = require('../models/CodingProblem');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for resume uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(new Error('Only PDF and Word documents are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get all jobs (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { status, companyId, title, location } = req.query;
    const query = {};

    if (status) query.status = status;
    if (companyId) query.companyId = companyId;
    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };

    const jobs = await Job.find(query)
      .populate('companyId', 'companyName industry location logo')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new job
router.post('/', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const job = new Job({
      ...req.body,
      companyId: company._id
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'companyName industry location logo description website');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a job
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    const job = await Job.findOne({ _id: req.params.id, companyId: company._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    const job = await Job.findOneAndDelete({ 
      _id: req.params.id, 
      companyId: company._id 
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    // Delete all associated applications
    await JobApplication.deleteMany({ jobId: req.params.id });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Apply for a job
router.post('/:id/apply', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'This job is not accepting applications' });
    }

    // Check if user has already applied
    const existingApplication = await JobApplication.findOne({
      jobId: job._id,
      candidateId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new JobApplication({
      jobId: job._id,
      candidateId: req.user._id,
      coverLetter: req.body.coverLetter,
      resume: req.file ? {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      } : undefined
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all applications for a job (company only)
router.get('/:id/applications', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    const job = await Job.findOne({ _id: req.params.id, companyId: company._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const applications = await JobApplication.find({ jobId: job._id })
      .populate('candidateId', 'name email profile')
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update application status (company only)
router.patch('/:jobId/applications/:applicationId/status', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.applicationId, jobId: job._id },
      { status: req.body.status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get candidate's job applications
router.get('/applications/me', authMiddleware, async (req, res) => {
  try {
    const applications = await JobApplication.find({ candidateId: req.user._id })
      .populate('jobId')
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Download application resume
router.get('/applications/:id/resume', authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application || !application.resume || !application.resume.data) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check authorization
    const job = await Job.findById(application.jobId);
    const company = await Company.findById(job.companyId);
    
    if (application.candidateId.toString() !== req.user._id.toString() && 
        company.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.set('Content-Type', application.resume.contentType);
    res.set('Content-Disposition', `inline; filename="${application.resume.filename}"`);
    res.send(application.resume.data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Assign tests to an application
router.post('/:jobId/applications/:applicationId/assign-tests', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const { tests, codingProblems, dueDate } = req.body;

    const application = await JobApplication.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Initialize testAssignment if it doesn't exist
    if (!application.testAssignment) {
      application.testAssignment = { assignedTests: [], codingProblems: [] };
    }

    // Add tests
    if (tests && tests.length > 0) {
      const testAssignments = tests.map(testId => ({
        testId,
        assignedAt: new Date(),
        dueDate: dueDate
      }));
      application.testAssignment.assignedTests.push(...testAssignments);
    }

    // Add coding problems
    if (codingProblems && codingProblems.length > 0) {
      const problemAssignments = codingProblems.map(problemId => ({
        problemId,
        assignedAt: new Date(),
        dueDate: dueDate
      }));
      application.testAssignment.codingProblems.push(...problemAssignments);
    }

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update placement status
router.patch('/:jobId/applications/:applicationId/placement', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const { placementStatus, placementDetails } = req.body;
    const application = await JobApplication.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.placementStatus = placementStatus;
    if (placementDetails) {
      application.placementDetails = {
        ...application.placementDetails,
        ...placementDetails
      };
    }

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get assigned tests for an application
router.get('/:jobId/applications/:applicationId/tests', authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.applicationId)
      .populate('testAssignment.assignedTests.testId')
      .populate('testAssignment.codingProblems.problemId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization - only company or the candidate can view
    const company = await Company.findOne({ userId: req.user._id });
    if (application.candidateId.toString() !== req.user._id.toString() && 
        !company) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(application.testAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
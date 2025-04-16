import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [applying, setApplying] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs?status=active');
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      setMessage({ text: 'Failed to load jobs', type: 'danger' });
      setLoading(false);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);
    const formData = new FormData();
    if (coverLetter) formData.append('coverLetter', coverLetter);
    if (resume) formData.append('resume', resume);

    try {
      await axios.post(
        `http://localhost:5000/api/jobs/${selectedJob._id}/apply`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setShowApplyModal(false);
      setMessage({ text: 'Application submitted successfully!', type: 'success' });
      setCoverLetter('');
      setResume(null);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to submit application', 
        type: 'danger' 
      });
    } finally {
      setApplying(false);
    }
  };

  const filteredAndSortedJobs = jobs
    .filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyId.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesType = !selectedType || job.employmentType === selectedType;
      const matchesLevel = !selectedLevel || job.experienceLevel === selectedLevel;
      return matchesSearch && matchesLocation && matchesType && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'salary-high':
          return (b.salary.max || 0) - (a.salary.max || 0);
        case 'salary-low':
          return (a.salary.min || 0) - (b.salary.min || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">Loading available jobs...</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Available Jobs</h2>

      {message.text && (
        <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage({ text: '', type: '' })}>
          {message.text}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search jobs by title, company, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Location..."
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Experience Level</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="salary-high">Highest Salary</option>
                <option value="salary-low">Lowest Salary</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredAndSortedJobs.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No jobs found</h4>
            <p className="text-muted">Try adjusting your search criteria</p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {filteredAndSortedJobs.map(job => (
            <Col md={6} lg={4} key={job._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    {job.companyId.logo ? (
                      <img
                        src={`http://localhost:5000/api/company/logo/${job.companyId._id}`}
                        alt={job.companyId.companyName}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        className="me-3"
                      />
                    ) : (
                      <div 
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px'
                        }}
                      >
                        <i className="fas fa-building text-muted"></i>
                      </div>
                    )}
                    <div>
                      <h5 className="mb-1">{job.title}</h5>
                      <p className="mb-0 text-muted">{job.companyId.companyName}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-muted mb-2">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {job.location}
                    </p>
                    <p className="text-muted mb-2">
                      <i className="fas fa-briefcase me-2"></i>
                      {job.employmentType}
                    </p>
                    <p className="text-muted mb-2">
                      <i className="fas fa-layer-group me-2"></i>
                      {job.experienceLevel}
                    </p>
                    {job.salary.min && job.salary.max && (
                      <p className="text-muted mb-0">
                        <i className="fas fa-money-bill-wave me-2"></i>
                        {`${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.period}`}
                      </p>
                    )}
                  </div>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary"
                      onClick={() => handleViewDetails(job)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => handleApply(job)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Job Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob && (
            <div>
              <div className="d-flex align-items-center mb-4">
                {selectedJob.companyId.logo ? (
                  <img
                    src={`http://localhost:5000/api/company/logo/${selectedJob.companyId._id}`}
                    alt={selectedJob.companyId.companyName}
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    className="me-3"
                  />
                ) : (
                  <div 
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px'
                    }}
                  >
                    <i className="fas fa-building text-muted"></i>
                  </div>
                )}
                <div>
                  <h5 className="mb-1">{selectedJob.companyId.companyName}</h5>
                  <p className="mb-0 text-muted">{selectedJob.location}</p>
                </div>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <h6>Employment Type</h6>
                  <p>{selectedJob.employmentType}</p>
                </Col>
                <Col md={6}>
                  <h6>Experience Level</h6>
                  <p>{selectedJob.experienceLevel}</p>
                </Col>
              </Row>

              {selectedJob.salary.min && selectedJob.salary.max && (
                <div className="mb-4">
                  <h6>Salary Range</h6>
                  <p>{`${selectedJob.salary.currency} ${selectedJob.salary.min.toLocaleString()} - ${selectedJob.salary.max.toLocaleString()} ${selectedJob.salary.period}`}</p>
                </div>
              )}

              <div className="mb-4">
                <h6>Job Description</h6>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedJob.description}</p>
              </div>

              <div className="mb-4">
                <h6>Requirements</h6>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedJob.requirements}</p>
              </div>

              <div className="mb-4">
                <h6>Responsibilities</h6>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedJob.responsibilities}</p>
              </div>

              {selectedJob.companyId.description && (
                <div className="mb-4">
                  <h6>About the Company</h6>
                  <p>{selectedJob.companyId.description}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowDetailsModal(false);
            handleApply(selectedJob);
          }}>
            Apply for this Position
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Apply Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitApplication}>
            <Form.Group className="mb-3">
              <Form.Label>Resume</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                required
              />
              <Form.Text className="text-muted">
                Upload your resume (PDF, DOC, or DOCX format)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cover Letter (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're a great fit for this position..."
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={applying}
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Jobs;
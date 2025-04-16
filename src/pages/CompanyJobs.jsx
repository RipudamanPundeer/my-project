import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/company/jobs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      setMessage({ text: 'Failed to load jobs', type: 'danger' });
      setLoading(false);
    }
  };

  const handleDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJobs(jobs.filter(job => job._id !== jobToDelete._id));
      setShowDeleteModal(false);
      setMessage({ text: 'Job deleted successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to delete job', type: 'danger' });
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/company/jobs/edit/${jobId}`);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'secondary';
      case 'closed': return 'danger';
      default: return 'primary';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h1>&nbsp;</h1>
        <h2>Job Listings</h2>
        <Button 
          variant="primary" 
          onClick={() => navigate('/company/jobs/new')}
        >
          <i className="fas fa-plus-circle me-2"></i>
          Post New Job
        </Button>
      </div>

      {message.text && (
        <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage({ text: '', type: '' })}>
          {message.text}
        </Alert>
      )}

      {jobs.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No jobs posted yet</h4>
            <p className="text-muted">Start by creating your first job posting</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/company/jobs/new')}
            >
              Create Job Posting
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {jobs.map(job => (
            <Col md={6} lg={4} key={job._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Badge bg={getStatusBadgeVariant(job.status)}>
                      {job.status}
                    </Badge>
                    <div className="dropdown">
                      <Button 
                        variant="link" 
                        className="text-dark p-0"
                        onClick={() => handleEdit(job._id)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-danger p-0 ms-2"
                        onClick={() => handleDelete(job)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                  <h5 className="card-title mb-3">{job.title}</h5>
                  <p className="text-muted mb-2">
                    <i className="fas fa-building me-2"></i>
                    {job.department}
                  </p>
                  <p className="text-muted mb-2">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {job.location}
                  </p>
                  <p className="text-muted mb-0">
                    <i className="fas fa-clock me-2"></i>
                    {job.employmentType}
                  </p>
                </Card.Body>
                <Card.Footer className="bg-transparent">
                  <div className="d-grid">
                    <Button 
                      variant="outline-primary"
                      onClick={() => handleEdit(job._id)}
                    >
                      Edit Job Details
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this job posting? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CompanyJobs;
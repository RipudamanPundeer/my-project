import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function NewJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [job, setJob] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: '',
    experienceLevel: '',
    description: '',
    requirements: '',
    responsibilities: '',
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'yearly'
    },
    status: 'draft'
  });

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJob(response.data);
    } catch (error) {
      setMessage({ 
        text: 'Failed to load job details', 
        type: 'danger' 
      });
      navigate('/company/jobs');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setJob(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setJob(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/jobs/${id}`, job, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/jobs', job, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      navigate('/company/jobs');
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || `Failed to ${id ? 'update' : 'create'} job posting`, 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    setJob(prev => ({ ...prev, status: 'draft' }));
    handleSubmit();
  };

  const handlePublish = () => {
    setJob(prev => ({ ...prev, status: 'active' }));
    handleSubmit();
  };

  // Validate form
  const isFormValid = () => {
    return job.title && 
           job.department && 
           job.location && 
           job.employmentType && 
           job.experienceLevel && 
           job.description && 
           job.requirements && 
           job.responsibilities;
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">{id ? 'Edit Job' : 'Create New Job'}</h2>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/company/jobs')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>

          {message.text && (
            <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage({ text: '', type: '' })}>
              {message.text}
            </Alert>
          )}

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={job.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={job.department}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={job.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., New York, NY or Remote"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employment Type</Form.Label>
                  <Form.Select
                    name="employmentType"
                    value={job.employmentType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience Level</Form.Label>
                  <Form.Select
                    name="experienceLevel"
                    value={job.experienceLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Salary Currency</Form.Label>
                  <Form.Select
                    name="salary.currency"
                    value={job.salary.currency}
                    onChange={handleInputChange}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Min Salary</Form.Label>
                  <Form.Control
                    type="number"
                    name="salary.min"
                    value={job.salary.min}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Max Salary</Form.Label>
                  <Form.Control
                    type="number"
                    name="salary.max"
                    value={job.salary.max}
                    onChange={handleInputChange}
                    placeholder="e.g., 80000"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Period</Form.Label>
                  <Form.Select
                    name="salary.period"
                    value={job.salary.period}
                    onChange={handleInputChange}
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="hourly">Hourly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={job.description}
                onChange={handleInputChange}
                required
                placeholder="Provide a detailed description of the role..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="requirements"
                value={job.requirements}
                onChange={handleInputChange}
                required
                placeholder="List the key requirements and qualifications..."
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Responsibilities</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="responsibilities"
                value={job.responsibilities}
                onChange={handleInputChange}
                required
                placeholder="List the main responsibilities and duties..."
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary"
                onClick={handleSaveAsDraft}
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button 
                variant="primary"
                onClick={handlePublish}
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Publishing...' : (id ? 'Update Job' : 'Publish Job')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default NewJob;
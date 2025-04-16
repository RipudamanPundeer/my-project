import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Card, Form, Alert, Row, Col, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs/applications/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load applications. Please try again.');
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'reviewing':
        return 'info';
      case 'shortlisted':
        return 'primary';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleViewTests = async (application) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/jobs/${application.jobId}/applications/${application._id}/tests`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.data.assignedTests?.length > 0) {
        navigate(`/test/${response.data.assignedTests[0].testId}`);
      } else if (response.data.codingProblems?.length > 0) {
        navigate(`/coding-problem/${response.data.codingProblems[0].problemId}`);
      }
    } catch (error) {
      setError('Failed to load assigned tests. Please try again.');
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const filteredApplications = applications
    .filter(app => filterStatus === 'all' || app.status.toLowerCase() === filterStatus)
    .filter(app => 
      searchTerm === '' || 
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">Loading your applications...</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Applications</h2>
            <div className="d-flex gap-3">
              <Form.Control
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '300px' }}
              />
              <Form.Select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: '200px' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </div>
          </div>

          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          {filteredApplications.length === 0 ? (
            <div className="text-center py-5">
              <h4>No applications found</h4>
              <p className="text-muted">
                {applications.length === 0 
                  ? "You haven't applied to any jobs yet" 
                  : "No applications match your current filters"}
              </p>
            </div>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Job Position</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(application => (
                  <tr key={application._id}>
                    <td>
                      <div className="fw-bold">{application.job?.title}</div>
                      <div className="text-muted small">
                        {application.job?.department} • {application.job?.location}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {application.job?.companyId?.logo ? (
                          <img
                            src={`http://localhost:5000/api/company/logo/${application.job.companyId._id}`}
                            alt=""
                            style={{ 
                              width: '30px', 
                              height: '30px', 
                              objectFit: 'cover',
                              marginRight: '10px'
                            }}
                          />
                        ) : (
                          <div 
                            className="me-2 d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '30px', 
                              height: '30px', 
                              backgroundColor: '#f8f9fa',
                              borderRadius: '4px'
                            }}
                          >
                            <i className="fas fa-building text-muted"></i>
                          </div>
                        )}
                        {application.job?.companyId?.companyName}
                      </div>
                    </td>
                    <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex flex-column gap-2">
                        <Badge bg={getStatusBadgeVariant(application.status)}>
                          {application.status}
                        </Badge>
                        {application.status === 'accepted' && application.testAssignment && (
                          <div className="d-flex flex-column gap-1">
                            {application.testAssignment.assignedTests?.length > 0 && (
                              <Badge bg="info" className="cursor-pointer" onClick={() => handleViewTests(application)}>
                                View Assigned Tests ({application.testAssignment.assignedTests.length})
                              </Badge>
                            )}
                            {application.testAssignment.codingProblems?.length > 0 && (
                              <Badge bg="info" className="cursor-pointer" onClick={() => handleViewTests(application)}>
                                View Coding Problems ({application.testAssignment.codingProblems.length})
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewDetails(application)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)} 
        size="lg"
        className="application-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <div>
              <h5>{selectedApplication.job?.title}</h5>
              <p className="text-muted mb-4">
                {selectedApplication.job?.companyId?.companyName} • {selectedApplication.job?.location}
              </p>

              <Row className="mb-4">
                <Col md={6}>
                  <h6>Status</h6>
                  <Badge bg={getStatusBadgeVariant(selectedApplication.status)}>
                    {selectedApplication.status}
                  </Badge>
                </Col>
                <Col md={6}>
                  <h6>Applied On</h6>
                  <p>{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                </Col>
              </Row>

              {selectedApplication.coverLetter && (
                <div className="mb-4">
                  <h6>Cover Letter</h6>
                  <Card.Text className="bg-light p-3 rounded">
                    {selectedApplication.coverLetter}
                  </Card.Text>
                </div>
              )}

              {selectedApplication.resume && (
                <div className="mb-4">
                  <h6>Submitted Resume</h6>
                  <Button 
                    variant="outline-primary"
                    size="sm"
                    href={`http://localhost:5000/api/jobs/applications/${selectedApplication._id}/resume?token=${localStorage.getItem('token')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </Button>
                </div>
              )}

              {selectedApplication.status === 'accepted' && selectedApplication.testAssignment && (
                <div>
                  <h6>Assigned Assessments</h6>
                  {selectedApplication.testAssignment.assignedTests?.length > 0 && (
                    <div className="mb-2">
                      <Badge bg="info">
                        {selectedApplication.testAssignment.assignedTests.length} Test(s) Assigned
                      </Badge>
                    </div>
                  )}
                  {selectedApplication.testAssignment.codingProblems?.length > 0 && (
                    <div>
                      <Badge bg="info">
                        {selectedApplication.testAssignment.codingProblems.length} Coding Problem(s) Assigned
                      </Badge>
                    </div>
                  )}
                  <Button 
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      handleViewTests(selectedApplication);
                      setShowDetailsModal(false);
                    }}
                  >
                    Start Assessment
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MyApplications;
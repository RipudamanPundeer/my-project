import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Card, Dropdown, Form, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/company/applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const application = applications.find(app => app._id === applicationId);
      await axios.patch(
        `http://localhost:5000/api/jobs/${application.jobId._id}/applications/${applicationId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setShowProfileModal(true);
  };

  const handleViewResume = (applicationId) => {
    const token = localStorage.getItem('token');
    window.open(
      `http://localhost:5000/api/jobs/applications/${applicationId}/resume?token=${token}`,
      '_blank'
    );
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

  const filteredApplications = applications
    .filter(app => filterStatus === 'all' || app.status.toLowerCase() === filterStatus)
    .filter(app => 
      searchTerm === '' || 
      app.candidateId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Job Applications</h2>
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
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-5">
              <h4>No applications found</h4>
              <p className="text-muted">No job applications match your current filters</p>
            </div>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job Position</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(application => (
                  <tr key={application._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={application.candidateId.profile?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(application.candidateId.name)}&background=random`}
                          alt=""
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%',
                            marginRight: '10px',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleViewProfile(application.candidateId)}
                        />
                        <div>
                          <div className="fw-bold" style={{ cursor: 'pointer' }} onClick={() => handleViewProfile(application.candidateId)}>
                            {application.candidateId.name}
                          </div>
                          <small className="text-muted">{application.candidateId.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{application.jobId.title}</td>
                    <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(application.status)}>
                        {application.status}
                      </Badge>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm">
                          Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleViewProfile(application.candidateId)}>
                            View Profile
                          </Dropdown.Item>
                          {application.resume && (
                            <Dropdown.Item onClick={() => handleViewResume(application._id)}>
                              View Resume
                            </Dropdown.Item>
                          )}
                          <Dropdown.Divider />
                          <Dropdown.Header>Update Status</Dropdown.Header>
                          <Dropdown.Item 
                            onClick={() => handleStatusChange(application._id, 'reviewing')}
                            disabled={application.status === 'reviewing'}
                          >
                            Mark as Reviewing
                          </Dropdown.Item>
                          <Dropdown.Item 
                            onClick={() => handleStatusChange(application._id, 'shortlisted')}
                            disabled={application.status === 'shortlisted'}
                          >
                            Shortlist
                          </Dropdown.Item>
                          <Dropdown.Item 
                            onClick={() => handleStatusChange(application._id, 'accepted')}
                            disabled={application.status === 'accepted'}
                          >
                            Accept
                          </Dropdown.Item>
                          <Dropdown.Item 
                            onClick={() => handleStatusChange(application._id, 'rejected')}
                            disabled={application.status === 'rejected'}
                            className="text-danger"
                          >
                            Reject
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Candidate Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Candidate Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCandidate && (
            <Row>
              <Col md={4} className="text-center mb-4">
                <img
                  src={selectedCandidate.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCandidate.name)}&background=random`}
                  alt={selectedCandidate.name}
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1rem'
                  }}
                />
                <h4>{selectedCandidate.name}</h4>
                <p className="text-muted mb-3">{selectedCandidate.email}</p>
              </Col>
              <Col md={8}>
                {selectedCandidate.profile?.bio && (
                  <div className="mb-4">
                    <h6 className="text-muted mb-2">About</h6>
                    <p>{selectedCandidate.profile.bio}</p>
                  </div>
                )}

                {selectedCandidate.profile?.skills?.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-muted mb-2">Skills</h6>
                    <div>
                      {selectedCandidate.profile.skills.map((skill, index) => (
                        <Badge key={index} bg="primary" className="me-2 mb-2">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Row className="mb-4">
                  {selectedCandidate.profile?.college && (
                    <Col md={6} className="mb-3">
                      <h6 className="text-muted mb-1">Education</h6>
                      <p className="mb-1">{selectedCandidate.profile.college}</p>
                      {selectedCandidate.profile?.degree && (
                        <p className="mb-1">{selectedCandidate.profile.degree}</p>
                      )}
                      {selectedCandidate.profile?.graduationYear && (
                        <p className="mb-0">Class of {selectedCandidate.profile.graduationYear}</p>
                      )}
                    </Col>
                  )}
                  
                  {selectedCandidate.profile?.phoneNumber && (
                    <Col md={6} className="mb-3">
                      <h6 className="text-muted mb-1">Contact</h6>
                      <p className="mb-0">{selectedCandidate.profile.phoneNumber}</p>
                    </Col>
                  )}
                </Row>

                {(selectedCandidate.profile?.linkedIn || selectedCandidate.profile?.github) && (
                  <div>
                    <h6 className="text-muted mb-2">Social Links</h6>
                    {selectedCandidate.profile?.linkedIn && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        href={selectedCandidate.profile.linkedIn}
                        target="_blank"
                        className="me-2 mb-2"
                      >
                        <i className="fab fa-linkedin me-2"></i>
                        LinkedIn Profile
                      </Button>
                    )}
                    {selectedCandidate.profile?.github && (
                      <Button
                        variant="outline-dark"
                        size="sm"
                        href={selectedCandidate.profile.github}
                        target="_blank"
                        className="mb-2"
                      >
                        <i className="fab fa-github me-2"></i>
                        GitHub Profile
                      </Button>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Applications;
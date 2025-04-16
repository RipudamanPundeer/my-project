import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Card, Dropdown, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      await axios.patch(`http://localhost:5000/api/company/applications/${applicationId}/status`, 
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
      app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                          src={application.candidate.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(application.candidate.name)}&background=random`}
                          alt=""
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%',
                            marginRight: '10px'
                          }}
                        />
                        <div>
                          <div>{application.candidate.name}</div>
                          <small className="text-muted">{application.candidate.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{application.job.title}</td>
                    <td>{new Date(application.appliedDate).toLocaleDateString()}</td>
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
                          <Dropdown.Item 
                            href={`/company/applications/${application._id}`}
                          >
                            View Details
                          </Dropdown.Item>
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
    </Container>
  );
}

export default Applications;
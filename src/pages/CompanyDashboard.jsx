import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function CompanyDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [companyStats, setCompanyStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyStats();
  }, []);

  const fetchCompanyStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/company/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCompanyStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching company stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-5">
      <Container>
        <div className="mb-5">
        <h1>&nbsp;</h1>
          <h1 className="mb-4">Welcome, {user.name}</h1>
          <p className="text-muted">Manage your job listings and candidate applications</p>
        </div>

        <Row className="mb-5 g-4">
          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="display-4 mb-2">{companyStats.totalJobs}</h3>
                <p className="text-muted mb-0">Total Jobs Posted</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="display-4 mb-2">{companyStats.activeJobs}</h3>
                <p className="text-muted mb-0">Active Jobs</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="display-4 mb-2">{companyStats.totalApplications}</h3>
                <p className="text-muted mb-0">Total Applications</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="display-4 mb-2">{companyStats.pendingReviews}</h3>
                <p className="text-muted mb-0">Pending Reviews</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h3 className="mb-4">Quick Actions</h3>
                <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    className="py-3"
                    onClick={() => navigate('/company/jobs/new')}
                  >
                    <i className="fas fa-plus-circle me-2"></i>
                    Post New Job
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="py-3"
                    onClick={() => navigate('/company/jobs')}
                  >
                    <i className="fas fa-list me-2"></i>
                    Manage Jobs
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="py-3"
                    onClick={() => navigate('/company/applications')}
                  >
                    <i className="fas fa-users me-2"></i>
                    View Applications
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h3 className="mb-4">Company Profile</h3>
                <div className="d-grid gap-3">
                  <Button 
                    variant="outline-secondary" 
                    className="py-3"
                    onClick={() => navigate('/company/profile')}
                  >
                    <i className="fas fa-building me-2"></i>
                    Edit Company Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CompanyDashboard;
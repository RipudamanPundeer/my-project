import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Button, Spinner, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      if (!user) {
        navigate("/login");
      }
    }, 500);
  }, [user, navigate]);

  if (loading) {
    return (
      <Container className="spinner-container">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="container">
          <Row className="align-items-center">
            <Col md={6} className="text-md-start">
              <div className="d-flex align-items-center mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2641/2641491.png"
                  width="40"
                  height="40"
                  className="me-3"
                  alt="Logo"
                />
                <h1 className="display-4 fw-bold mb-0">Mock Assessments</h1>
              </div>
              <p className="lead mb-4">
                Prepare for your dream job with our comprehensive assessment platform. 
                Practice tests, track progress, and improve your skills.
              </p>
              <Button 
                variant="light" 
                size="lg" 
                onClick={() => navigate("/dashboard")}
                className="me-3"
              >
                Start Learning
              </Button>
              <Button 
                variant="light" 
                size="lg"
                onClick={() => navigate("/results")}
              >
                View Progress
              </Button>
            </Col>
            <Col md={6} className="mt-4 mt-md-0">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Study"
                style={{ 
                  width: '100%',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              />
            </Col>
          </Row>
        </div>
      </div>

      <Container className="mt-5">
        <Row className="dashboard-stats g-4">
          <Col md={4}>
            <Card className="stat-card h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <i className="fas fa-user fa-2x text-primary"></i>
                  </div>
                  <div>
                    <h3 className="mb-1">Welcome Back</h3>
                    <h4 className="text-primary mb-0">{user?.name}</h4>
                  </div>
                </div>
                <p className="text-muted">{user?.email}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card h-100">
              <Card.Body>
                <h3 className="mb-4">Quick Actions</h3>
                <Button 
                  variant="primary" 
                  className="w-100 mb-3 py-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <i className="fas fa-edit me-2"></i>
                  Start New Test
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="w-100 py-2"
                  onClick={() => navigate("/results")}
                >
                  <i className="fas fa-chart-bar me-2"></i>
                  View Results
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card h-100">
              <Card.Body>
                <h3 className="mb-4">Account Settings</h3>
                <Button 
                  variant="outline-secondary" 
                  className="w-100 mb-3 py-2"
                >
                  <i className="fas fa-user-cog me-2"></i>
                  Edit Profile
                </Button>
                <Button 
                  variant="danger" 
                  className="w-100 py-2"
                  onClick={logout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h2 className="text-center mt-5 mb-4">Featured Content</h2>
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="custom-card h-100">
              <Card.Body>
                <div className="text-center mb-3">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                    alt="JavaScript"
                    style={{ width: '60px' }}
                  />
                </div>
                <Card.Title>JavaScript Track</Card.Title>
                <Card.Text>
                  Master JavaScript fundamentals, ES6 features, and advanced concepts with our comprehensive test series.
                </Card.Text>
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={() => navigate("/dashboard")}
                >
                  Start Practice
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="custom-card h-100">
              <Card.Body>
                <div className="text-center mb-3">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                    alt="React"
                    style={{ width: '60px' }}
                  />
                </div>
                <Card.Title>React Development</Card.Title>
                <Card.Text>
                  Test your React knowledge with questions covering components, hooks, state management, and more.
                </Card.Text>
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={() => navigate("/dashboard")}
                >
                  Start Practice
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="custom-card h-100">
              <Card.Body>
                <div className="text-center mb-3">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                    alt="Node.js"
                    style={{ width: '60px' }}
                  />
                </div>
                <Card.Title>Backend Development</Card.Title>
                <Card.Text>
                  Practice Node.js, Express, and MongoDB concepts to strengthen your backend development skills.
                </Card.Text>
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={() => navigate("/dashboard")}
                >
                  Start Practice
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-5 mb-4">
          <h2>Why Choose Us?</h2>
          <p className="text-muted">We provide comprehensive assessment solutions to help you succeed</p>
        </div>
        <Row className="g-4 mb-5">
          <Col md={3}>
            <div className="text-center">
              <div className="mb-3">
                <i className="fas fa-book fa-3x text-primary"></i>
              </div>
              <h4>Comprehensive Tests</h4>
              <p className="text-muted">Covering all major topics in web development</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center">
              <div className="mb-3">
                <i className="fas fa-chart-bar fa-3x text-primary"></i>
              </div>
              <h4>Progress Tracking</h4>
              <p className="text-muted">Monitor your improvement over time</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center">
              <div className="mb-3">
                <i className="fas fa-clock fa-3x text-primary"></i>
              </div>
              <h4>Timed Tests</h4>
              <p className="text-muted">Realistic exam environment</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center">
              <div className="mb-3">
                <i className="fas fa-shield-alt fa-3x text-primary"></i>
              </div>
              <h4>Anti-Cheat System</h4>
              <p className="text-muted">Ensuring fair assessments</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;

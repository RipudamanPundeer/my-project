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
        <h1>Welcome to Mock Assessments</h1>
        <p>Your personal learning journey starts here</p>
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
          alt="Study"
          style={{ 
            width: '100%', 
            maxWidth: '600px', 
            marginTop: '2rem',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      <Container>
        <Row className="dashboard-stats">
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <h3>Welcome Back</h3>
                <p className="mb-0">{user?.name}</p>
                <small className="text-muted">{user?.email}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <h3>Quick Actions</h3>
                <Button 
                  variant="primary" 
                  className="btn-custom-primary w-100 mb-2"
                  onClick={() => navigate("/dashboard")}
                >
                  Start New Test
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="w-100"
                  onClick={() => navigate("/results")}
                >
                  View Results
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <h3>Account</h3>
                <Button 
                  variant="danger" 
                  className="w-100"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <Card className="custom-card">
              <Card.Body>
                <Card.Title>Available Tests</Card.Title>
                <Card.Text>
                  Choose from a variety of topics including JavaScript, React, MongoDB, and Node.js.
                </Card.Text>
                <Button 
                  variant="primary" 
                  className="btn-custom-primary"
                  onClick={() => navigate("/dashboard")}
                >
                  Browse Tests
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="custom-card">
              <Card.Body>
                <Card.Title>Track Progress</Card.Title>
                <Card.Text>
                  View your test history and track your improvement over time.
                </Card.Text>
                <Button 
                  variant="primary" 
                  className="btn-custom-primary"
                  onClick={() => navigate("/results")}
                >
                  View History
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;

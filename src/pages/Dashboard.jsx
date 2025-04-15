import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTestIcon = (title) => {
    const icons = {
      'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'ReactJS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
    };
    
    for (const [key, value] of Object.entries(icons)) {
      if (title.includes(key)) {
        return value;
      }
    }
    return 'https://via.placeholder.com/50?text=Test';
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tests", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTests(response.data);
      } catch (err) {
        setError("Failed to load tests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="page-container">
      <div className="hero-section">
        <h2>Welcome, {user.name}! 🚀</h2>
        <p>Select a mock test to begin your assessment</p>
      </div>

      <Container>
        {loading && (
          <div className="spinner-container">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          {tests.map((test) => (
            <Col key={test._id} md={6} lg={4} className="mb-4">
              <Card className="custom-card h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="text-center mb-3">
                    <img
                      src={getTestIcon(test.title)}
                      alt={test.title}
                      style={{ width: '60px', height: '60px' }}
                    />
                  </div>
                  <Card.Title className="text-center mb-3">{test.title}</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    {test.description}
                  </Card.Text>
                  <div className="mt-auto text-center">
                    <Button 
                      variant="primary" 
                      className="btn-custom-primary"
                      onClick={() => navigate(`/test/${test._id}`)}
                    >
                      Start Test
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted text-center">
                  {test.questions.length} Questions
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-4">
          <Button 
            variant="outline-primary" 
            onClick={() => navigate("/home")}
            className="px-4"
          >
            Back to Homepage
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;

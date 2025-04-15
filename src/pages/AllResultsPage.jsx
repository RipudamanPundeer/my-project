import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

function AllResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/results", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setResults(response.data);
      } catch (err) {
        setError("Failed to load past results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const calculateStats = () => {
    if (results.length === 0) return { avgScore: 0, totalTests: 0, highestScore: 0 };
    
    const totalScore = results.reduce((acc, result) => acc + (result.score / result.totalQuestions) * 100, 0);
    const avgScore = totalScore / results.length;
    const highestScore = Math.max(...results.map(result => (result.score / result.totalQuestions) * 100));

    return {
      avgScore: Math.round(avgScore),
      totalTests: results.length,
      highestScore: Math.round(highestScore)
    };
  };

  if (loading) return (
    <div className="spinner-container">
      <Spinner animation="border" variant="primary" />
    </div>
  );
  
  if (error) return <Alert variant="danger">{error}</Alert>;

  const stats = calculateStats();

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>&nbsp;</h1>
        <h2>Your Learning Progress</h2>
        <p>Track your performance across all tests</p>
      </div>

      <Container>
        <Row className="dashboard-stats mb-5">
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <h3>{stats.avgScore}%</h3>
                <p className="text-muted mb-0">Average Score</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <h3>{stats.totalTests}</h3>
                <p className="text-muted mb-0">Tests Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body>
                <h3>{stats.highestScore}%</h3>
                <p className="text-muted mb-0">Highest Score</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h3 className="mb-4">Test History</h3>

        {results.length === 0 ? (
          <Alert variant="info">
            No past results found. Start taking tests to see your progress!
          </Alert>
        ) : (
          <Row>
            {results.map((result, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="custom-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">{result.testTitle}</h5>
                      <span 
                        className={`badge ${(result.score / result.totalQuestions) >= 0.7 ? 'bg-success' : 'bg-warning'}`}
                      >
                        {Math.round((result.score / result.totalQuestions) * 100)}%
                      </span>
                    </div>
                    <Card.Text>
                      Score: {result.score} / {result.totalQuestions}
                    </Card.Text>
                    <Card.Text className="text-muted">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </Card.Text>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => navigate(`/results/${result.testId}`, { state: result })}
                      className="w-100"
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div className="text-center mt-4 mb-5">
          <Button 
            variant="primary" 
            onClick={() => navigate("/dashboard")}
            className="me-3 btn-custom-primary"
          >
            Take New Test
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={() => navigate("/home")}
          >
            Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default AllResultsPage;

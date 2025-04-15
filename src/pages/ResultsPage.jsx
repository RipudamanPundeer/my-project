import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

function ResultsPage() {
  const { state } = useLocation(); 
  const navigate = useNavigate();

  if (!state) return <p>No results found.</p>;

  const scorePercentage = (state.score / state.totalQuestions) * 100;
  const getScoreColor = () => {
    if (scorePercentage >= 80) return '#2ecc71';
    if (scorePercentage >= 60) return '#f1c40f';
    return '#e74c3c';
  };

  return (
    <div className="page-container">
      <div className="hero-section">
        <h2>Test Results</h2>
        <div className="score-circle" style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `conic-gradient(${getScoreColor()} ${scorePercentage * 3.6}deg, #ecf0f1 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '2rem auto',
          position: 'relative'
        }}>
          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <h3 style={{ color: getScoreColor(), margin: 0 }}>{scorePercentage}%</h3>
            <small>Score</small>
          </div>
        </div>
        <p style={{ fontSize: '1.2rem' }}>
          {state.score} correct out of {state.totalQuestions} questions
        </p>
      </div>

      <Container>
        <h3 className="mb-4">Detailed Results</h3>
        {state.results.map((result, index) => (
          <Card key={index} className="custom-card mb-4">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <div className="d-flex align-items-center mb-3">
                    <div className="question-number me-3" style={{
                      background: result.isCorrect ? '#2ecc71' : '#e74c3c',
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      {index + 1}
                    </div>
                    <h5 className="mb-0">{result.question}</h5>
                  </div>
                </Col>
                <Col md={4} className="text-md-end">
                  {result.isCorrect ? (
                    <span className="badge bg-success px-3 py-2">Correct</span>
                  ) : (
                    <span className="badge bg-danger px-3 py-2">Incorrect</span>
                  )}
                </Col>
              </Row>
              
              <div className="ms-5 mt-3">
                <p>
                  <strong>Your Answer: </strong>
                  <span className={result.isCorrect ? 'text-success' : 'text-danger'}>
                    {result.selectedAnswer}
                  </span>
                </p>
                {!result.isCorrect && (
                  <p>
                    <strong>Correct Answer: </strong>
                    <span className="text-success">{result.correctAnswer}</span>
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}

        <div className="text-center mt-4 mb-5">
          <Button 
            variant="primary" 
            onClick={() => navigate("/dashboard")}
            className="me-3 btn-custom-primary"
          >
            Take Another Test
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={() => navigate("/results")}
          >
            View All Results
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ResultsPage;

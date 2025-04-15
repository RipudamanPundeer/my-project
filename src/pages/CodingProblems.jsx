import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CodingProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, easy, medium, hard
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/coding-problems', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'primary';
    }
  };

  const filteredProblems = problems.filter(problem => 
    filter === 'all' || problem.difficulty.toLowerCase() === filter
  );

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>&nbsp;</h1>
        <h2>Coding Problems</h2>
        <p className="lead">Practice coding problems and improve your problem-solving skills</p>
      </div>

      <Container>
        <div className="mb-4 d-flex justify-content-end">
          <Form.Select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Form.Select>
        </div>

        <Row className="g-4">
          {loading ? (
            <div className="text-center">Loading problems...</div>
          ) : (
            filteredProblems.map(problem => (
              <Col key={problem._id} md={6} lg={4}>
                <Card 
                  className="custom-card h-100" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/coding-problem/${problem._id}`)}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{problem.title}</Card.Title>
                      <Badge bg={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <Card.Text className="text-muted">
                      {problem.description.length > 100 
                        ? `${problem.description.substring(0, 100)}...` 
                        : problem.description}
                    </Card.Text>
                    <div className="mt-2">
                      {problem.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          bg="secondary" 
                          className="me-1"
                          style={{ opacity: 0.8 }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
}

export default CodingProblems;
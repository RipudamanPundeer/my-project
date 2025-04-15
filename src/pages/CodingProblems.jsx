import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Pagination, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Editor from '@monaco-editor/react';

function CodingProblems() {
  const { user } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(9);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const [problemsRes, userRes] = await Promise.all([
          axios.get('http://localhost:5000/api/coding-problems', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        setProblems(problemsRes.data);
        setSolvedProblems(userRes.data.solvedProblems || []);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const fetchSolution = async (problemId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/coding-problems/${problemId}/submission`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedSolution(response.data);
      setShowSolutionModal(true);
    } catch (error) {
      console.error('Error fetching solution:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'primary';
    }
  };

  const isProblemSolved = (problemId) => {
    return solvedProblems.includes(problemId);
  };

  const filteredProblems = problems.filter(problem => 
    (filter === 'all' || problem.difficulty.toLowerCase() === filter) &&
    (searchTerm === '' || problem.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedTags.length === 0 || selectedTags.some(tag => problem.tags.includes(tag)))
  );

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>&nbsp;</h1>
        <h2>Coding Problems</h2>
        <p className="lead">Practice coding problems and improve your problem-solving skills</p>
      </div>

      <Container>
        <div className="mb-4 d-flex justify-content-between">
          <InputGroup style={{ width: '50%' }}>
            <Form.Control 
              type="text" 
              placeholder="Search problems..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
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

        <Row className="g-4 mb-4">
          {loading ? (
            <div className="text-center">Loading problems...</div>
          ) : currentProblems.length === 0 ? (
            <div className="text-center">No problems found matching your criteria</div>
          ) : (
            currentProblems.map(problem => (
              <Col key={problem._id} md={6} lg={4}>
                <Card 
                  className={`custom-card h-100 ${isProblemSolved(problem._id) ? 'border-success' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div 
                        className="problem-title"
                        onClick={() => navigate(`/coding-problem/${problem._id}`)}
                      >
                        <Card.Title className="mb-0">{problem.title}</Card.Title>
                        {isProblemSolved(problem._id) && (
                          <Badge bg="success" className="ms-2">
                            <i className="fas fa-check"></i> Solved
                          </Badge>
                        )}
                      </div>
                      <Badge bg={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <Card.Text className="text-muted">
                      {problem.description.length > 100 
                        ? `${problem.description.substring(0, 100)}...` 
                        : problem.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
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
                      {isProblemSolved(problem._id) && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchSolution(problem._id);
                          }}
                        >
                          View Solution
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        <Pagination className="justify-content-center">
          {Array.from({ length: Math.ceil(filteredProblems.length / problemsPerPage) }, (_, index) => (
            <Pagination.Item 
              key={index + 1} 
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>

        {/* Solution Modal */}
        <Modal 
          show={showSolutionModal} 
          onHide={() => setShowSolutionModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Your Solution</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSolution && (
              <>
                <div className="mb-3">
                  <strong>Language:</strong> {selectedSolution.language}
                  <br />
                  <strong>Submitted:</strong> {new Date(selectedSolution.submittedAt).toLocaleString()}
                </div>
                <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                  <Editor
                    height="400px"
                    language={selectedSolution.language}
                    value={selectedSolution.code}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default CodingProblems;
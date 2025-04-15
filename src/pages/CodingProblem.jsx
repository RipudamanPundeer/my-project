import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert, Modal } from 'react-bootstrap';
import Editor from '@monaco-editor/react';
import axios from 'axios';

function CodingProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [showStartModal, setShowStartModal] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVariant, setModalVariant] = useState('danger');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fullscreen mode handlers
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    setIsFullscreen(true);
    setShowStartModal(false);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  const checkFullscreen = useCallback(() => {
    const isInFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    if (!isInFullscreen && isFullscreen) {
      setModalMessage('Warning: Fullscreen mode exited! Please return to fullscreen.');
      setModalVariant('warning');
      setShowModal(true);
    }
    setIsFullscreen(!!isInFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/coding-problems/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProblem(response.data);
        // Set initial template code for selected language
        const template = response.data.templateCode.find(t => t.language === language);
        if (template) {
          setCode(template.code);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, language]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('msfullscreenchange', checkFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('msfullscreenchange', checkFullscreen);
    };
  }, [checkFullscreen]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Update code to template for new language
    const template = problem?.templateCode.find(t => t.language === newLanguage);
    if (template) {
      setCode(template.code);
    }
  };

  const handleTest = async () => {
    setSubmitting(true);
    setTestResults(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/coding-problems/${id}/test`,
        { code, language },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTestResults(response.data);
    } catch (error) {
      console.error('Test error:', error);
      setTestResults({
        success: false,
        error: error.response?.data?.message || 'Error testing solution'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResults(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/coding-problems/${id}/submit`,
        { code, language },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setResults(response.data);
      
      if (response.data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          exitFullscreen();
          navigate('/coding-problems');
        }, 2000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setResults({
        success: false,
        error: error.response?.data?.message || 'Error submitting solution'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'primary';
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="text-center mt-5">Problem not found</div>;
  }

  return (
    <div className="page-container">
      <h1>&nbsp;</h1>

      {/* Instructions Modal */}
      <Modal 
        show={showStartModal} 
        backdrop="static" 
        keyboard={false}
        centered
      >
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>Start Coding Challenge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Before starting the challenge, please note:</p>
          <ul>
            <li>The challenge will run in fullscreen mode</li>
            <li>You can choose your preferred programming language</li>
            <li>You can test your code against sample test cases</li>
            <li>Hidden test cases will be used for final submission</li>
            <li>Make sure your code handles all edge cases</li>
          </ul>
          <p>Click "Start Challenge" when you're ready to begin in fullscreen mode.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate("/coding-problems")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={enterFullscreen}>
            Start Challenge
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Warning Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={`bg-${modalVariant} text-white`}>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button 
            variant={modalVariant} 
            onClick={() => {
              setShowModal(false);
              if (!isFullscreen) {
                enterFullscreen();
              }
            }}
          >
            Return to Fullscreen
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} backdrop="static" keyboard={false}>
        <Modal.Header className="bg-success text-white">
          <Modal.Title>Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '48px' }}></i>
            <h4 className="mt-3">Problem Solved Successfully!</h4>
            <p>Redirecting to problems list...</p>
          </div>
        </Modal.Body>
      </Modal>

      <Container fluid>
        <Row>
          {/* Problem Description Panel */}
          <Col md={6} lg={5} className="mb-4">
            <Card className="custom-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h2>{problem.title}</h2>
                  <Badge bg={getDifficultyColor(problem.difficulty)} className="ms-2">
                    {problem.difficulty}
                  </Badge>
                </div>

                <div className="mb-4">
                  <h5>Description</h5>
                  <div style={{ whiteSpace: 'pre-line' }}>{problem.description}</div>
                </div>

                <div className="mb-4">
                  <h5>Constraints</h5>
                  <pre className="constraints">{problem.constraints}</pre>
                </div>

                <div className="mb-4">
                  <h5>Sample Test Cases</h5>
                  {problem.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
                    <Card key={index} className="mb-2">
                      <Card.Body>
                        <div><strong>Input:</strong> {testCase.input}</div>
                        <div><strong>Expected Output:</strong> {testCase.expectedOutput}</div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

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
              </Card.Body>
            </Card>
          </Col>

          {/* Code Editor Panel */}
          <Col md={6} lg={7}>
            <Card className="custom-card mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="btn-group">
                    <Button 
                      variant={language === 'javascript' ? 'primary' : 'outline-primary'}
                      onClick={() => handleLanguageChange('javascript')}
                    >
                      JavaScript
                    </Button>
                    <Button 
                      variant={language === 'python' ? 'primary' : 'outline-primary'}
                      onClick={() => handleLanguageChange('python')}
                    >
                      Python
                    </Button>
                    <Button 
                      variant={language === 'java' ? 'primary' : 'outline-primary'}
                      onClick={() => handleLanguageChange('java')}
                    >
                      Java
                    </Button>
                  </div>
                  <div>
                    <Button 
                      variant="info" 
                      onClick={handleTest}
                      disabled={submitting}
                      className="me-2"
                    >
                      {submitting ? 'Testing...' : 'Test Solution'}
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Solution'}
                    </Button>
                  </div>
                </div>

                <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                  <Editor
                    height="500px"
                    language={language}
                    value={code}
                    onChange={setCode}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      automaticLayout: true,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Test Results Panel */}
            {testResults && (
              <Card className="custom-card mb-4">
                <Card.Header className={`bg-${testResults.success ? 'info' : 'warning'} text-white`}>
                  <h5 className="mb-0">
                    Sample Test Cases Results
                  </h5>
                </Card.Header>
                <Card.Body>
                  {testResults.results.map((result, index) => (
                    <Alert 
                      key={index} 
                      variant={result.passed ? 'success' : 'warning'}
                      className="mb-2"
                    >
                      <div className="d-flex justify-content-between">
                        <strong>Test Case {index + 1}</strong>
                        <span>{result.passed ? 'Passed' : 'Failed'}</span>
                      </div>
                      <div><strong>Input:</strong> {result.input}</div>
                      <div><strong>Expected:</strong> {result.expectedOutput}</div>
                      {!result.passed && (
                        <div><strong>Your Output:</strong> {result.actualOutput}</div>
                      )}
                      {result.error && (
                        <div className="text-danger mt-2">Error: {result.error}</div>
                      )}
                      <div className="text-muted mt-1">
                        Time: {result.time}ms | Memory: {Math.round(result.memory / 1024)} MB
                      </div>
                    </Alert>
                  ))}
                </Card.Body>
              </Card>
            )}

            {/* Final Results Panel */}
            {results && (
              <Card className="custom-card">
                <Card.Header className={`bg-${results.success ? 'success' : 'danger'} text-white`}>
                  <h5 className="mb-0">
                    {results.success ? 'All Test Cases Passed!' : 'Some Test Cases Failed'}
                  </h5>
                </Card.Header>
                <Card.Body>
                  {results.results.map((result, index) => (
                    <Alert 
                      key={index} 
                      variant={result.passed ? 'success' : 'danger'}
                      className="mb-2"
                    >
                      <div className="d-flex justify-content-between">
                        <strong>Test Case {index + 1}</strong>
                        <span>{result.passed ? 'Passed' : 'Failed'}</span>
                      </div>
                      {!result.hidden && (
                        <>
                          <div><strong>Input:</strong> {result.input}</div>
                          <div><strong>Expected:</strong> {result.expectedOutput}</div>
                          {!result.passed && (
                            <div><strong>Your Output:</strong> {result.actualOutput}</div>
                          )}
                        </>
                      )}
                      {result.hidden && <div className="text-muted">Hidden test case</div>}
                      {result.error && (
                        <div className="text-danger mt-2">Error: {result.error}</div>
                      )}
                      <div className="text-muted mt-1">
                        Time: {result.time}ms | Memory: {Math.round(result.memory / 1024)} MB
                      </div>
                    </Alert>
                  ))}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CodingProblem;
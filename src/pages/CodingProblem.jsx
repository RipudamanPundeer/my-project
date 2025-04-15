import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import Editor from '@monaco-editor/react';
import axios from 'axios';

function CodingProblem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

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

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Update code to template for new language
    const template = problem?.templateCode.find(t => t.language === newLanguage);
    if (template) {
      setCode(template.code);
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
                  <Button 
                    variant="success" 
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Running...' : 'Submit Solution'}
                  </Button>
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

            {/* Results Panel */}
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
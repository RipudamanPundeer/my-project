import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Form, Modal, ProgressBar } from "react-bootstrap";
import axios from "axios";

function TestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState("danger");
  const [timeLeft, setTimeLeft] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);

  // Function to enter fullscreen
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
      setShowStartModal(false);
    } catch (err) {
      console.error("Error entering fullscreen:", err);
      setModalMessage("Failed to enter fullscreen mode. Please try again.");
      setModalVariant("danger");
      setShowModal(true);
    }
  };

  // Function to check fullscreen status
  const checkFullscreen = useCallback(() => {
    const isInFullscreen = document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.msFullscreenElement;
    
    if (!isInFullscreen && isFullscreen) {
      setWarningCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          handleSubmit(true); // Force submit after 3 warnings
          return prev;
        }
        setModalMessage(`Warning: Fullscreen mode exited! Please return to fullscreen. (Warning ${newCount}/3)`);
        setModalVariant("warning");
        setShowModal(true);
        return newCount;
      });
    }
    setIsFullscreen(!!isInFullscreen);
  }, [isFullscreen]);

  // Function to handle test submission
  const handleSubmit = async (force = false) => {
    if (!force && Object.keys(answers).length !== test.questions.length) {
      setModalMessage("Please answer all questions before submitting!");
      setModalVariant("warning");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/tests/${id}/submit`, 
        { answers }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
      );
      navigate(`/results/${id}`, { state: response.data });
    } catch (err) {
      console.error("Error submitting test:", err);
      setModalMessage("Submission failed. Please try again.");
      setModalVariant("danger");
      setShowModal(true);
    }
  };

  // Function to handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setWarningCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          handleSubmit(true); // Force submit after 3 warnings
          return prev;
        }
        setModalMessage(`Warning: Switching tabs/windows detected! (Warning ${newCount}/3)`);
        setModalVariant("warning");
        setShowModal(true);
        return newCount;
      });
    }
  }, []);

  // Effect to handle timer and fetch test
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTest(response.data);
        setTimeLeft(response.data.duration * 60); // Convert minutes to seconds
      } catch (err) {
        setError("Failed to load test.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);
    document.addEventListener("msfullscreenchange", checkFullscreen);

    // Disable right-click and copy-paste
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handleCopy);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
      document.removeEventListener("msfullscreenchange", checkFullscreen);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handleCopy);
    };
  }, [id, handleVisibilityChange, checkFullscreen]);

  // Effect for timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Force submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const getProgress = () => {
    if (!test) return 0;
    return (Object.keys(answers).length / test.questions.length) * 100;
  };

  if (loading) return (
    <div className="spinner-container">
      <Spinner animation="border" variant="primary" />
    </div>
  );
  
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="page-container">
      {/* Start Test Modal */}
      <Modal 
        show={showStartModal} 
        backdrop="static" 
        keyboard={false}
        centered
      >
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>Start Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Before starting the test, please note:</p>
          <ul>
            <li>The test will run in fullscreen mode</li>
            <li>Exiting fullscreen mode will count as a warning</li>
            <li>After 3 warnings, your test will be automatically submitted</li>
            <li>The test is timed and will auto-submit when time runs out</li>
            <li>Switching tabs or windows is not allowed</li>
          </ul>
          <p>Click "Start Test" when you're ready to begin in fullscreen mode.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={enterFullscreen}>
            Start Test
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Warning Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
        <Modal.Header closeButton className={`bg-${modalVariant} text-white`}>
          <Modal.Title>Notification</Modal.Title>
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
            {!isFullscreen ? "Return to Fullscreen" : "Close"}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="hero-section">
        <h2>{test.title}</h2>
        <p>{test.description}</p>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className={`timer-badge ${timeLeft <= 300 ? 'bg-danger' : 'bg-primary'}`}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>
            Time Remaining: {formatTime(timeLeft)}
          </div>
        </div>
        <div className="mt-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <ProgressBar 
            now={getProgress()} 
            label={`${Math.round(getProgress())}%`}
            variant="success"
            style={{ height: '2rem', fontSize: '1rem' }}
          />
        </div>
      </div>

      <Container>
        {test.questions.map((q, index) => (
          <Card key={q._id} className="custom-card mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="question-number me-3"
                  style={{
                    background: answers[q._id] ? 'var(--secondary-color)' : '#6c757d',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}
                >
                  {index + 1}
                </div>
                <Card.Title className="mb-0">{q.questionText}</Card.Title>
              </div>
              
              <div className="ms-5">
                {q.options.map((option, i) => (
                  <Form.Check
                    key={i}
                    type="radio"
                    id={`question-${q._id}-option-${i}`}
                    name={`question-${q._id}`}
                    label={option}
                    onChange={() => handleAnswerChange(q._id, option)}
                    checked={answers[q._id] === option}
                    className="mb-2"
                    style={{
                      padding: '0.5rem',
                      border: answers[q._id] === option ? '1px solid var(--secondary-color)' : '1px solid transparent',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}

        <div className="text-center mt-4 mb-5">
          <Button 
            variant="success" 
            onClick={() => handleSubmit(false)}
            size="lg"
            className="px-5"
          >
            Submit Test
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default TestPage;

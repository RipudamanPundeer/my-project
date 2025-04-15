import React, { useState, useEffect } from "react";
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
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTest(response.data);
      } catch (err) {
        setError("Failed to load test.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleAnswerChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const getProgress = () => {
    if (!test) return 0;
    return (Object.keys(answers).length / test.questions.length) * 100;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== test.questions.length) {
      setModalMessage("Please answer all questions before submitting!");
      setModalVariant("warning");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/tests/${id}/submit`, 
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

  if (loading) return (
    <div className="spinner-container">
      <Spinner animation="border" variant="primary" />
    </div>
  );
  
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="page-container">
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
        <Modal.Header closeButton className={`bg-${modalVariant} text-white`}>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant={modalVariant} onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="hero-section">
        <h2>{test.title}</h2>
        <p>{test.description}</p>
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
            onClick={handleSubmit}
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

import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const userData = response.data.user;
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      // Fetch user profile immediately after login
      const profileResponse = await axios.get('http://localhost:5000/api/profile');
      const updatedUser = { ...userData, profile: profileResponse.data.profile };
      setUser(updatedUser);

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/home");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Container className="d-flex justify-content-center align-items-center" style={{ maxWidth: '450px' }}>
        <div className="auth-container" 
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            padding: '2.5rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            width: '100%'
          }}
        >
          <Modal show={showModal} centered>
            <Modal.Header className="bg-success text-white">
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>Login successful! Redirecting...</Modal.Body>
          </Modal>

          <h2 className="text-center mb-4">Welcome Back</h2>
          <p className="text-center text-muted mb-4">Login to access your assessments</p>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2 mb-3" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center mb-0">
              Don't have an account? <Link to="/register" className="text-primary">Register here</Link>
            </p>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;

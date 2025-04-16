import React, { useState } from "react";
import { Form, Button, Container, Alert, Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    description: "",
    phone: "",
    address: ""
  });

  const navigate = useNavigate();

  const handleCompanyDetailsChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const registrationData = {
        name,
        email,
        password,
        role,
        companyDetails: role === 'company' ? companyDetails : undefined
      };

      await axios.post("http://localhost:5000/api/auth/register", registrationData);

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
      <Container className="d-flex justify-content-center align-items-center" style={{ maxWidth: role === 'company' ? '800px' : '450px' }}>
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
            <Modal.Body>
              Registration successful! Redirecting to login page...
            </Modal.Body>
          </Modal>

          <h2 className="text-center mb-4">Create Account</h2>
          <p className="text-center text-muted mb-4">Join us to start your {role === 'candidate' ? 'learning journey' : 'hiring journey'}</p>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Register as</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="py-2"
              >
                <option value="candidate">Candidate</option>
                <option value="company">Company</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{role === 'company' ? 'Contact Person Name' : 'Full Name'}</Form.Label>
              <Form.Control
                type="text"
                placeholder={role === 'company' ? "Enter contact person name" : "Enter your name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

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

            {role === 'company' && (
              <div className="company-details mb-4">
                <h4 className="mb-3">Company Details</h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter company name"
                        name="companyName"
                        value={companyDetails.companyName}
                        onChange={handleCompanyDetailsChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Industry</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter industry"
                        name="industry"
                        value={companyDetails.industry}
                        onChange={handleCompanyDetailsChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Size</Form.Label>
                      <Form.Select
                        name="size"
                        value={companyDetails.size}
                        onChange={handleCompanyDetailsChange}
                        required
                        className="py-2"
                      >
                        <option value="">Select size</option>
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter location"
                        name="location"
                        value={companyDetails.location}
                        onChange={handleCompanyDetailsChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Enter company website"
                    name="website"
                    value={companyDetails.website}
                    onChange={handleCompanyDetailsChange}
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Company Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter company description"
                    name="description"
                    value={companyDetails.description}
                    onChange={handleCompanyDetailsChange}
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter contact phone"
                        name="phone"
                        value={companyDetails.phone}
                        onChange={handleCompanyDetailsChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter company address"
                        name="address"
                        value={companyDetails.address}
                        onChange={handleCompanyDetailsChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            <Button 
              variant="success" 
              type="submit" 
              className="w-100 py-2 mb-3" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>

            <p className="text-center mb-0">
              Already have an account? <Link to="/login" className="text-primary">Login here</Link>
            </p>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Register;
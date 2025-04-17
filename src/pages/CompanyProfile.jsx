import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function CompanyProfile() {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [company, setCompany] = useState({
    companyName: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    description: '',
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    socialMedia: {
      linkedIn: '',
      twitter: ''
    }
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/company', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCompany(response.data);
      if (response.data.logo) {
        setLogoPreview(`http://localhost:5000/api/company/logo/${response.data._id}`);
      }
      setLoading(false);
    } catch (error) {
      setMessage({ text: 'Failed to load company profile', type: 'danger' });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompany(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCompany(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logo) return;
    const formData = new FormData();
    formData.append('logo', logo);
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.post('http://localhost:5000/api/company/logo', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage({ text: 'Logo updated successfully!', type: 'success' });
      // Update the user context with the new logo information
      const updatedUser = {
        ...user,
        companyDetails: response.data
      };
      updateUserProfile(updatedUser);
    } catch (error) {
      setMessage({ text: 'Failed to update logo', type: 'danger' });
    }
  };

  const handleLogoDelete = async () => {
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.delete('http://localhost:5000/api/company/logo', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage({ text: 'Logo removed successfully!', type: 'success' });
      setLogoPreview(null);
      setLogo(null);
      // Update the user context with the updated company data
      const updatedUser = {
        ...user,
        companyDetails: response.data
      };
      updateUserProfile(updatedUser);
    } catch (error) {
      setMessage({ text: 'Failed to remove logo', type: 'danger' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.put('http://localhost:5000/api/company', company, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Update the user context with the new company information
      const updatedUser = {
        ...user,
        companyDetails: response.data
      };
      updateUserProfile(updatedUser);
      setMessage({ text: 'Company profile updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to update company profile', type: 'danger' });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Company Profile</h2>
          {message.text && (
            <Alert variant={message.type} className="mb-4">
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Logo</Form.Label>
                  <div className="d-flex align-items-center mb-2">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="me-3"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div className="me-3" style={{ width: '100px', height: '100px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        No Logo
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div className="mt-2">
                    <Button variant="primary" onClick={handleLogoUpload} disabled={!logo} className="me-2">
                      {company.logo ? 'Update Logo' : 'Upload Logo'}
                    </Button>
                    {company.logo && (
                      <Button variant="outline-danger" onClick={handleLogoDelete}>
                        Remove Logo
                      </Button>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={company.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Industry</Form.Label>
                  <Form.Control
                    type="text"
                    name="industry"
                    value={company.industry}
                    onChange={handleInputChange}
                    required
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
                    value={company.size}
                    onChange={handleInputChange}
                    required
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
                    name="location"
                    value={company.location}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                name="website"
                value={company.website}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={company.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <h4 className="mb-3">Contact Information</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactInfo.email"
                    value={company.contactInfo?.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactInfo.phone"
                    value={company.contactInfo?.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactInfo.address"
                    value={company.contactInfo?.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mb-3">Social Media</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn</Form.Label>
                  <Form.Control
                    type="url"
                    name="socialMedia.linkedIn"
                    value={company.socialMedia?.linkedIn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control
                    type="url"
                    name="socialMedia.twitter"
                    value={company.socialMedia?.twitter}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button variant="primary" type="submit" size="lg">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CompanyProfile;
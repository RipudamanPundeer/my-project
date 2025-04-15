import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profile: {
      college: '',
      degree: '',
      graduationYear: '',
      skills: [],
      bio: '',
      phoneNumber: '',
      linkedIn: '',
      github: ''
    }
  });

  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      setMessage({ text: 'Failed to load profile', type: 'danger' });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills
      }
    }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update profile information
      const response = await axios.put('http://localhost:5000/api/profile', profile.profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Upload photo if selected
      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);
        const photoResponse = await axios.post('http://localhost:5000/api/profile/photo', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        response.data = photoResponse.data;
      }

      // Upload resume if selected
      if (resume) {
        const formData = new FormData();
        formData.append('resume', resume);
        const resumeResponse = await axios.post('http://localhost:5000/api/profile/resume', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        response.data = resumeResponse.data;
      }

      updateUserProfile(response.data);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      fetchProfile();
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'danger' });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Profile Settings</h2>
          {message.text && (
            <Alert variant={message.type} className="mb-4">
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  {profile.profile?.photo && (
                    <img
                      src={`http://localhost:5000/${profile.profile.photo}`}
                      alt="Profile"
                      className="mt-2"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Resume</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                  />
                  {profile.profile?.resume && (
                    <a
                      href={`http://localhost:5000/${profile.profile.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 d-block"
                    >
                      View Current Resume
                    </a>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>College/University</Form.Label>
                  <Form.Control
                    type="text"
                    name="profile.college"
                    value={profile.profile?.college || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Degree</Form.Label>
                  <Form.Control
                    type="text"
                    name="profile.degree"
                    value={profile.profile?.degree || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Graduation Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="profile.graduationYear"
                    value={profile.profile?.graduationYear || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="profile.phoneNumber"
                    value={profile.profile?.phoneNumber || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={profile.profile?.skills?.join(', ') || ''}
                onChange={handleSkillsChange}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="profile.bio"
                value={profile.profile?.bio || ''}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn Profile</Form.Label>
                  <Form.Control
                    type="url"
                    name="profile.linkedIn"
                    value={profile.profile?.linkedIn || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GitHub Profile</Form.Label>
                  <Form.Control
                    type="url"
                    name="profile.github"
                    value={profile.profile?.github || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button variant="primary" type="submit" size="lg">
                Save Profile
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
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
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState('');
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
      if (response.data.profile?.photo) {
        setPhotoPreview(`http://localhost:5000/api/profile/photo/${response.data._id}`);
      } else {
        setPhotoPreview(null); // Ensure preview is null if no photo
      }
      if (response.data.profile?.resume) {
        setResumeName(response.data.profile.resume.filename);
      } else {
        setResumeName(''); // Ensure name is empty if no resume
      }
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
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumeName(file.name);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photo) return;
    const formData = new FormData();
    formData.append('photo', photo);
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.post('http://localhost:5000/api/profile/photo', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage({ text: 'Photo updated successfully!', type: 'success' });
      
      // Update the user context with the complete user data
      const updatedUser = {
        ...user,
        ...response.data
      };
      updateUserProfile(updatedUser);
    } catch (error) {
      setMessage({ text: 'Failed to update photo', type: 'danger' });
    }
  };

  const handleResumeUpload = async () => {
    if (!resume) return;
    const formData = new FormData();
    formData.append('resume', resume);
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.post('http://localhost:5000/api/profile/resume', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage({ text: 'Resume updated successfully!', type: 'success' });
      // Update the user context with the new profile data
      const updatedUser = {
        ...user,
        ...response.data
      };
      updateUserProfile(updatedUser);
    } catch (error) {
      setMessage({ text: 'Failed to update resume', type: 'danger' });
    }
  };

  const handleRemovePhoto = async () => {
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.delete('http://localhost:5000/api/profile/photo', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage({ text: 'Photo removed successfully!', type: 'success' });
      setPhotoPreview(null);
      setPhoto(null);
      
      // Update the user context with the complete response data
      const updatedUser = {
        ...user,
        ...response.data
      };
      updateUserProfile(updatedUser);
    } catch (error) {
      setMessage({ text: 'Failed to remove photo', type: 'danger' });
    }
  };

  const handleRemoveResume = async () => {
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.delete('http://localhost:5000/api/profile/resume', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage({ text: 'Resume removed successfully!', type: 'success' });
      setResume(null);
      setResumeName('');
      // Update the user context with the complete response data
      const updatedUser = {
        ...user,
        ...response.data
      };
      updateUserProfile(updatedUser);
    } catch (error) {
      setMessage({ text: 'Failed to remove resume', type: 'danger' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      // Update profile text information
      const response = await axios.put('http://localhost:5000/api/profile', profile.profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage({ text: 'Profile details updated successfully!', type: 'success' });
      // Update the user context with the new profile data
      const updatedUser = {
        ...user,
        ...response.data
      };
      updateUserProfile(updatedUser);
    } catch (error) {
      setMessage({ text: 'Failed to update profile details', type: 'danger' });
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
            {/* First Row - Photo and Resume */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Photo</Form.Label>
                  <div className="d-flex align-items-center mb-2">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="me-3"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <div className="me-3" style={{ width: '100px', height: '100px', border: '1px dashed #ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        No Photo
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <Button variant="primary" onClick={handlePhotoUpload} disabled={!photo} className="me-2">
                    {profile.profile?.photo ? 'Update Photo' : 'Upload Photo'}
                  </Button>
                  {profile.profile?.photo && (
                    <Button variant="outline-danger" onClick={handleRemovePhoto}>
                      Remove Photo
                    </Button>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Resume</Form.Label>
                  <div className="d-flex align-items-center mb-2">
                    {resumeName && profile._id ? (
                      <div className="me-3">
                        <a
                          href={`http://localhost:5000/api/profile/resume/${profile._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          <i className="fas fa-file-pdf me-2"></i>
                          {resumeName}
                        </a>
                      </div>
                    ) : (
                      <div className="me-3 text-muted">No Resume Uploaded</div>
                    )}
                    <Form.Control
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <Button variant="primary" onClick={handleResumeUpload} disabled={!resume} className="me-2">
                    {profile.profile?.resume ? 'Update Resume' : 'Upload Resume'}
                  </Button>
                  {profile.profile?.resume && (
                    <Button variant="outline-danger" onClick={handleRemoveResume}>
                      Remove Resume
                    </Button>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Second Row - College and Degree */}
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

            {/* Third Row - Graduation Year and Phone */}
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

            {/* Skills Section */}
            <Form.Group className="mb-3">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={profile.profile?.skills?.join(', ') || ''}
                onChange={handleSkillsChange}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </Form.Group>

            {/* Bio Section */}
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

            {/* Fourth Row - Social Links */}
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
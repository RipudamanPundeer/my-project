import React, { useContext, useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AppNavbar() {
  const { user, logout, profileUpdateKey } = useContext(AuthContext);
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentPhotoSrc, setCurrentPhotoSrc] = useState(null); // Local state for image src

  const getNavLinkClass = (path) => {
    return `nav-link ${location.pathname === path ? 'active' : ''}`;
  };

  const closeNav = () => setExpanded(false);

  // Effect to update the local image source when profile key changes
  useEffect(() => {
    setImageError(false); // Reset error on update
    if (user?.profile?.photo?.data && user?.id) {
      // Construct the URL with the update key as timestamp
      const newSrc = `http://localhost:5000/api/profile/photo/${user.id}?t=${profileUpdateKey}`;
      setCurrentPhotoSrc(newSrc);
    } else {
      setCurrentPhotoSrc(null); // Clear src if no photo data
    }
  }, [profileUpdateKey, user?.id, user?.profile?.photo?.data]); // Depend on key and user photo data

  const getProfileImage = () => {
    if (currentPhotoSrc && !imageError) {
      return currentPhotoSrc;
    }
    // Fallback to UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`;
  };

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      fixed="top" 
      className="navbar-main"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/home" onClick={closeNav} className="navbar-brand-custom">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2641/2641491.png"
            width="30"
            height="30"
            className="d-inline-block align-top brand-logo"
            alt="Logo"
          />
          <span className="ms-2">Mock Assessments</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center">
            {user ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/home" 
                  className={getNavLinkClass('/home')}
                  onClick={closeNav}
                >
                  Home
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className={getNavLinkClass('/dashboard')}
                  onClick={closeNav}
                >
                  Tests
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/results" 
                  className={getNavLinkClass('/results')}
                  onClick={closeNav}
                >
                  Results
                </Nav.Link>
                <Dropdown className="nav-dropdown ms-lg-2">
                  <Dropdown.Toggle 
                    variant="outline-light" 
                    id="nav-dropdown"
                    className="user-dropdown-toggle"
                  >
                    <img
                      // Key still useful for React reconciliation, based on whether we have a src
                      key={currentPhotoSrc || 'avatar-fallback'}
                      src={getProfileImage()} // Use the local state for src
                      width="32"
                      height="32"
                      className="rounded-circle me-2"
                      alt={user.name}
                      style={{ objectFit: 'cover' }}
                      onError={() => {
                        setImageError(true);
                        setCurrentPhotoSrc(null); // Clear src on error to prevent retry loops
                      }}
                      loading="eager" // Keep eager loading for navbar image
                    />
                    <span className="d-none d-lg-inline">{user.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end" className="dropdown-menu-dark">
                    <Dropdown.Item as={Link} to="/profile" onClick={closeNav}>
                      <i className="fas fa-user me-2"></i>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={() => {
                        closeNav();
                        logout();
                      }} 
                      className="text-danger"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <div className="d-flex flex-column flex-lg-row gap-2 align-items-stretch align-items-lg-center">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light"
                  className="auth-button"
                  onClick={closeNav}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="light"
                  className="auth-button"
                  onClick={closeNav}
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

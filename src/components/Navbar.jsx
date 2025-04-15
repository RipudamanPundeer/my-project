import React, { useContext } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getNavLinkClass = (path) => {
    return `nav-link ${location.pathname === path ? 'active' : ''}`;
  };

  return (
    <Navbar bg="white" expand="lg" className="navbar-custom" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2641/2641491.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Logo"
          />
          Mock Assessments
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/home" className={getNavLinkClass('/home')}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/dashboard" className={getNavLinkClass('/dashboard')}>
                  Tests
                </Nav.Link>
                <Nav.Link as={Link} to="/results" className={getNavLinkClass('/results')}>
                  Results
                </Nav.Link>
                <Dropdown align="end" className="ms-2">
                  <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      width="24"
                      height="24"
                      className="rounded-circle me-2"
                      alt={user.name}
                    />
                    {user.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/home">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} className="text-danger">
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className={getNavLinkClass('/login')}>
                  Login
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="ms-2 btn-custom-primary"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

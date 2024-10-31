import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Row, Col } from 'react-bootstrap';
// import './NavBar.css'; // Updated CSS

export default function NavBar() {
  const location = useLocation();

  // Hide the NavBar on the login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="px-4 py-3 border-bottom border-dark"
    >
      <Navbar.Brand as={Link} to="/">
        Storesystem
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/dashboard">
            Dashboard
          </Nav.Link>
          <NavDropdown title="Company" id="company-dropdown">
            <NavDropdown.Item as={Link} to="/bir-permit-types">
              BIR Permit Types
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bir-permits">
              BIR Permits
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Transactions" id="company-dropdown">
            <NavDropdown.Item as={Link} to="/purchases">
              Purchases
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bir-permits">
              Inventory Adjustments
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bir-permits">
              Journal Entries
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bir-permits">
              Auto Journal Entries
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Reports" id="company-dropdown">
            <NavDropdown.Item as={Link} to="/bir-permit-types">
              Inventory
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bir-permits">
              Sales
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bir-permits">
              Finance
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Documents" id="company-dropdown">
            <NavDropdown.Item as={Link} to="/documents">
              View Company
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/documents/add">
              Add Company
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link as={Link} to="/register">
            Add User
          </Nav.Link>
          <Nav.Link as={Link} to="/delivery">
            Delivery
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

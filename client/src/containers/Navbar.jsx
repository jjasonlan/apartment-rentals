import React from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavigationBar (props) {
  const {
    user,
    handleLogout,
    gotoHome,
    gotoMap,
    gotoUsers,
  } = props;
  const isAdmin = user.role === 'admin';

  return (
    <Navbar>
      <Navbar.Brand onClick={gotoHome}>Home</Navbar.Brand>
      <Navbar.Toggle />
      <Nav className="mr-auto">
        <Nav.Link onClick={gotoMap}>Map</Nav.Link>
        {isAdmin && <Nav.Link onClick={gotoUsers}>Users</Nav.Link>}
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          Signed in as: {user.name}
        </Navbar.Text>
        <Button
          className="logout"
          size="med"
          type="button"
          variant="outline-dark"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  )
}

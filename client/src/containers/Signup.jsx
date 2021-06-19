import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Signup.css";

export default function Signup(props) {
  const { loginAsUser, handleLogin } = props;
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleType, setRoleType] = useState("");
  const [message, setMessage] = useState("");

  function validateForm() {
    return roleType.length > 0 && name.length > 0 && username.length > 0
      && password.length > 0 && confirmPassword.length > 0
      && password === confirmPassword;
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch("/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        username,
        password,
        role: roleType,
      }),
    }).then(res => res.json())
      .then(res => {
        const {message} = res;
        if (message === 'account created') {
          loginAsUser({
            name,
            username,
            role: roleType,
          });
        } else {
          setMessage(message);
        }
      });
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="Signup">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="role">
          <DropdownButton
            variant="outline-dark"
            title={capitalizeFirstLetter(roleType) || "Role Type"}
            id="input-group-dropdown"
          >
            <Dropdown.Item href="#" value="client" onClick={() => setRoleType('client')}>
              Client
            </Dropdown.Item>
            <Dropdown.Item href="#" value="realtor" onClick={() => setRoleType('realtor')}>
              Realtor
            </Dropdown.Item>
          </DropdownButton>
        </Form.Group>
        <Form.Group size="lg" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            autoFocus
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            autoFocus
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Signup
        </Button>
        <Button className="login" size="sm" type="button" onClick={handleLogin}>
          Login
        </Button>
        { message && <Alert key="message" variant="danger">{message}</Alert> }
      </Form>
    </div>
  );
}

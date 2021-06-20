import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';

export default function EditUser (props) {
  const {
    user,
    name,
    roleType,
    setName,
    setRoleType
  } = props;

  if (!user) {
    return null;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group size="lg" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          autoFocus
          placeholder={user.name}
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group size="lg" controlId="role">
        <DropdownButton
          variant="outline-dark"
          title={capitalizeFirstLetter(roleType) || "Role Type"}
          id="input-group-dropdown"
        >
          <Dropdown.Item value="client" onClick={() => setRoleType('client')}>
            Client
          </Dropdown.Item>
          <Dropdown.Item value="realtor" onClick={() => setRoleType('realtor')}>
            Realtor
          </Dropdown.Item>
          <Dropdown.Item value="admin" onClick={() => setRoleType('admin')}>
            Admin
          </Dropdown.Item>
        </DropdownButton>
      </Form.Group>
    </Form>
  )
}

import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function CreateUser(props) {
  const {
    username,
    password,
    name,
    roleType,
    setUsername,
    setPassword,
    setName,
    setRoleType,
  } = props

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
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
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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

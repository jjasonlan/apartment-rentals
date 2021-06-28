import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import './AdminUsers.css'

// user management page
export default function AdminUsers(props) {
  const { user: currentUser } = props;
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  // new or edited user
  const [name, setName] = useState('');
  const [roleType, setRoleType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetch('/users')
      .then(res => res.json())
      .then(res => {
        const {users: responseUsers} = res;
        const formatted = {};
        responseUsers.forEach(user => {
          formatted[user.username] = user;
        })
        setUsers(formatted);
      })
  }, []);

  // clear toast after 3s
  useEffect(() => {
    setTimeout(
      () => setMessage(''), 
      3000
    );
  }, [message]);

  const clearEdits = () => {
    setName('');
    setRoleType('');
    setUsername('');
    setPassword('');
    setEditing('');
    setCreating(false);
  };

  const handleEdit = (user) => () => {
    setRoleType(user.role);
    setEditing(user.username);
  }

  const handleSave = () => {
    if (creating) {
      handleSaveCreate();
    } else {
      handleSaveEdit();
    }
  };

  const handleSaveCreate = () => {
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
        const {message, user} = res;
        if (message === 'account created') {
          setUsers({
            ...users,
            [user._id]: {
              name,
              username,
              role: roleType,
            }
          });
        } else {
          setMessage(message);
        }
      });
      clearEdits();
  };

  const handleSaveEdit = () => {
    const username = editing;
    const userUpdate = {
      username,
      ...name ? {name} : {},
      ...roleType ? {role: roleType} : {},
    };
    fetch('/editUser', {
      method: "PUT",
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userUpdate),
    }).then(res => res.json())
      .then(res => {
        if (res.message === 'update successful') {
          const updatedUser = users[username];
          setUsers({
            ...users,
            [username]: {
              ...updatedUser,
              ...userUpdate,
            }
          })
        } else {
          setMessage(res.message);
        }
      });
    clearEdits();
  }

  const handleDelete = (username) => () => {
    if (username === currentUser.username) {
      setMessage('Cannot delete current user');
      return;
    }
    fetch('/deleteUser', {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({username}),
    }).then(res => res.json())
      .then(res => {
        if (res.message === 'delete successful') {
          const newUsers = {...users};
          delete newUsers[username];
          setUsers(newUsers)
        } else {
          setMessage(res.message);
        }
      });
  }

  return (
    <div className="container">
      <h3>Manage Users</h3>
      { message && <Alert key="message" variant="danger">{message}</Alert> }
      <Button className="new-user" onClick={() => setCreating(true)}>New User</Button>
      <Modal
        show={!!editing || !!creating}
        onHide={clearEdits} 
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>{creating ? 'Create User' : 'Edit User ' + editing}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {creating
            ? <CreateUser
              name={name}
              roleType={roleType}
              username={username}
              password={password}
              setName={setName}
              setRoleType={setRoleType}
              setUsername={setUsername}
              setPassword={setPassword}
            />
            : <EditUser
              user={users[editing]}
              name={name}
              roleType={roleType}
              setName={setName}
              setRoleType={setRoleType}
            />
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={clearEdits}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Table className="users-table" responsive="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(users).map(user => {
            return (
              <tr key={user.username}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button className="edit"
                    size="sm"
                    type="button"
                    variant="warning"
                    onClick={handleEdit(user)}
                  >Edit</Button>
                  <Button className="delete"
                    size="sm"
                    type="button"
                    variant="danger"
                    onClick={handleDelete(user.username)}
                  >Delete</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
};

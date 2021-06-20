import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import EditUser from './EditUser';
import './AdminUsers.css'

// user management page
export default function AdminUsers(props) {
  const { user: currentUser } = props;
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState('');
  const [message, setMessage] = useState('');

  // edited user
  const [name, setName] = useState("");
  const [roleType, setRoleType] = useState("");
  // edited user state setters
  const setEditedName = (name) => setName(name);
  const setEditedRoleType = (roleType) => setRoleType(roleType);

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
    setEditing('');
  };

  const handleEdit = (user) => () => {
    console.log(user)
    setRoleType(user.role);
    setEditing(user.username);
  }

  const handleSave = () => {
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
      alert('Cannot delete current user');
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
      <h1>Manage Users</h1>
      <Modal
        show={!!editing}
        onHide={clearEdits} 
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User {editing}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditUser
            user={users[editing]}
            name={name}
            roleType={roleType}
            setName={setEditedName}
            setRoleType={setEditedRoleType}
          />
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

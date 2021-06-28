import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import CreateOrEditListing from './CreateOrEditListing';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import './GridView.css';

const isClient = (user) => user.role === 'client';

export default function GridView (props) {
  const {
    allApartments,
    apartments,
    user,
    setApartments,
    setFilteredApartments,
    filters,
    setFilters
  } = props;
  // filters
  const {
    minSize,
    maxSize,
    minRooms,
    maxRooms,
    minPrice,
    maxPrice,
  } = filters;
  const {
    setMinSize,
    setMaxSize,
    setMinRooms,
    setMaxRooms,
    setMinPrice,
    setMaxPrice,
  } = setFilters;
  
  // new listing fields
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [realtor, setRealtor] = useState({});

  const [message, setMessage] = useState('');

  const fields = {
    name,
    description,
    rooms,
    price,
    size,
    realtor,
    lat,
    long,
  };

  const fieldSetters = {
    setName,
    setDescription,
    setRooms: (v) => setRooms(parseNumberInput(v)),
    setPrice: (v) => setPrice(parseNumberInput(v)),
    setSize: (v) => setSize(parseNumberInput(v)),
    setLat: (v) => setLat(parseNumberInput(v)),
    setLong: (v) => setLong(parseNumberInput(v)),
    setRealtor,
  };

  const clearEdits = () => {
    setName('');
    setDescription('');
    setSize('');
    setRooms('');
    setPrice('');
    setLat('');
    setLong('');
    setRealtor({});
    setCreating(false);
    setEditing('');
  };

  const handleEdit = () => {
    fetch('/editListing', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: editing,
        name,
        description,
        size,
        price,
        rooms,
        location: [lat, long],
        realtor_name: realtor.name,
        realtor: realtor.username,
      }),
    }).then(res => res.json())
      .then(res => {
        const { message } = res;
        if (message === 'update successful') {
          const newApartments = [...allApartments];
          const index = newApartments.findIndex(apartment => apartment._id === editing);
          const apartment = {
            ...newApartments[index],
            name,
            description,
            size,
            price,
            rooms,
            location: [lat, long],
            realtor_name: realtor.name,
            realtor: realtor.username,
          }
          if (index > -1) {
            newApartments.splice(index, 1, apartment);
            setApartments(newApartments);
          }
        } else {
          const { message } = res;
          setMessage(message);
        }
      })
    clearEdits();
  };

  const selectForEditing = (apartment) => {
    setName(apartment.name);
    setDescription(apartment.description);
    setSize(apartment.size);
    setRooms(apartment.rooms);
    setPrice(apartment.price);
    setLat(apartment.location[0]);
    setLong(apartment.location[1]);
    setRealtor({
      name: apartment.realtor_name,
      username: apartment.realtor,
    });
    setEditing(apartment._id);
  };

  const handleDelete = () => {
    fetch('/deleteListing', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: editing,
      }),
    }).then(res => res.json())
      .then(res => {
        const {message} = res;
        if (message === 'delete successful') {
          const apartments = [...allApartments];
          const index = apartments.findIndex(apartment => apartment._id === editing);
          apartments.splice(index, 1);
          setApartments(apartments);
        }
      })
    clearEdits();
  }

  const handleSave = () => {
    fetch('/addListing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        size,
        price,
        rooms,
        location: [lat, long],
        created_date: new Date(),
        realtor_name: realtor.name,
        realtor: realtor.username,
        rented: false,
      }),
    }).then(res => res.json())
      .then(res => {
        const { message } = res;
        if (message === 'apartment listing created') {
          setApartments([...allApartments, {
            name,
            description,
            size,
            price,
            rooms,
            location: [lat, long],
            created_date: new Date(),
            realtor_name: realtor.name,
            realtor: realtor.username,
            rented: false,
          }]);
        } else {
          setMessage(message);
        }
      })
    clearEdits();
  };

  useEffect(() => {
    setTimeout(
      () => setMessage(''), 
      3000
    );
  }, [message]);

  useEffect(() => {
    const filterFunction = (apartment) => {
      if (isClient(user) && apartment.rented) {
        return false;
      }
      if (apartment.size < minSize || (maxSize && (apartment.size > maxSize))) {
        return false;
      }
      if (apartment.rooms < minRooms || (maxRooms && (apartment.rooms > maxRooms))) {
        return false;
      }
      if (apartment.price < minPrice || (maxPrice && (apartment.price > maxPrice))) {
        return false;
      }
      return true;
    };
    setFilteredApartments(allApartments.filter(filterFunction));
  },
  [
    user,
    allApartments,
    minSize,
    maxSize,
    minRooms,
    maxRooms,
    minPrice,
    maxPrice,
    setFilteredApartments,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const parseNumberInput = (value) => {
    if (!value || isNaN(value)) {
      return '';
    }
    return parseInt(value, 10);
  }

  const toggleRented = (apartment) => (e) => {
    fetch('editListing', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: apartment._id,
        rented: !apartment.rented,
      }),
    }).then(res => res.json())
      .then(res => {
        if (res.message !== 'update successful') {
          setMessage('error updating apartment listing');
          return;
        }
        const newApartments = [...allApartments];
        const index = newApartments.indexOf(apartment);
        if (index > -1) {
          newApartments.splice(index, 1, {
            ...apartment,
            rented: !apartment.rented,
          });
          setApartments(newApartments);
        }
      })
  }

  const isRentedOrAvailable = (isRented) => {
    return isRented ? 'rented' : 'available';
  }

  return (
    <div className='grid-container'>
      { message && <Alert key="message" variant="danger">{message}</Alert> }
      <h3>Home</h3>
      <Modal
        show={!!creating || !!editing}
        onHide={clearEdits} 
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>{creating ? 'Create Listing' : 'Edit Listing'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateOrEditListing
            fields={fields}
            fieldSetters={fieldSetters}
          />
        </Modal.Body>
        <Modal.Footer>
          {editing && <Button style={{position: 'absolute', left: 'calc(12px + .25rem)'}} variant='danger' onClick={handleDelete}>Delete</Button>}
          <Button variant="secondary" onClick={clearEdits}>
            Close
          </Button>
          <Button variant="primary" onClick={creating ? handleSave : handleEdit}>
            {creating ? 'Add' : 'Edit'} Listing
          </Button>
        </Modal.Footer>
      </Modal>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Form.Group as={Col} size="sm" controlId="min-size">
            <Form.Label>Min Size</Form.Label>
            <Form.Control
              autoFocus
              type="number"
              value={minSize}
              onChange={(e) => setMinSize(parseNumberInput(e.target.value))}
            />
          </Form.Group>
          <Form.Group as={Col} size="sm" controlId="max-size">
            <Form.Label>Max Size</Form.Label>
            <Form.Control
              autoFocus
              type="number"
              value={maxSize}
              onChange={(e) => setMaxSize(parseNumberInput(e.target.value))}
            />
          </Form.Group>
          <Form.Group as={Col} size="sm" controlId="min-rooms">
            <Form.Label>Min Rooms</Form.Label>
            <Form.Control
              autoFocus
              type="number"
              value={minRooms}
              onChange={(e) => setMinRooms(parseNumberInput(e.target.value))}
            />
          </Form.Group>
          <Form.Group as={Col} size="sm" controlId="max-rooms">
            <Form.Label>Max Rooms</Form.Label>
            <Form.Control
              autoFocus
              type="number"
              value={maxRooms}
              onChange={(e) => setMaxRooms(parseNumberInput(e.target.value))}
            />
          </Form.Group>
          <Form.Group as={Col} size="sm" controlId="min-price">
            <Form.Label>Min Price</Form.Label>
            <Form.Control
              autoFocus
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(parseNumberInput(e.target.value))}
            />
          </Form.Group>
          <Form.Group as={Col} size="sm" controlId="max-price">
            <Form.Label>Max Price</Form.Label>
            <Form.Control
              autoFocus
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseNumberInput(e.target.value))}
            />
          </Form.Group>
          {!isClient(user) && <Button onClick={() => setCreating(true)} className="new">Add Listing</Button>}
        </Form.Row>
      </Form>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Floor Area Size</th>
            <th>Rooms</th>
            <th>Price Per Month</th>
            <th>Location</th>
            <th>Date Added</th>
            <th>Realtor</th>
            {!isClient(user) && <th>Status</th> }
          </tr>
        </thead>
        <tbody>
          {Object.values(apartments).map(apartment => {
            const rentedOrAvailable = isRentedOrAvailable(apartment.rented);
            const rentedButtonVariant = apartment.rented ? 'secondary' : 'success';
            return (
              <tr key={apartment._id}>
                <td style={{position: 'relative', 'padding-right': '15px'}}>
                  {apartment.name}
                  <i onClick={() => selectForEditing(apartment)} className="bi bi-pencil icon"></i>
                </td>
                <td>{apartment.description}</td>
                <td>{apartment.size} sqft.</td>
                <td>{apartment.rooms}</td>
                <td>${apartment.price}</td>
                <td>({apartment.location[0]}, {apartment.location[1]})</td>
                <td>{new Date(apartment.created_date).toDateString()}</td>
                <td>{apartment.realtor_name}</td>
                {!isClient(user)
                  && <td>
                      <Button
                        variant={rentedButtonVariant}
                        onClick={toggleRented(apartment)}
                      >{rentedOrAvailable}</Button>
                    </td> }
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  )
}

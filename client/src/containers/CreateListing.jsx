import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function CreateListing(props) {
  const {
    fields,
    fieldSetters,
  } = props;

  const {
    name,
    description,
    size,
    rooms,
    price,
    lat,
    long,
    realtor,
    rented,
  } = fields;

  const {
    setName,
    setDescription,
    setSize,
    setRooms,
    setPrice,
    setLat,
    setLong,
    setRealtor,
    setRented,
  } = fieldSetters;

  const [realtors, setRealtors] = useState([]);

  useEffect(() => {
    fetch('/realtors')
      .then(res => res.json())
      .then(res => {
        const { users } = res;
        setRealtors(users);
      })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group size="lg" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group size="lg" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group size="lg" controlId="size">
        <Form.Label>Size</Form.Label>
        <Form.Control
          autoFocus
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </Form.Group>
      <Form.Group size="lg" controlId="rooms">
        <Form.Label>Rooms</Form.Label>
        <Form.Control
          autoFocus
          type="number"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
        />
      </Form.Group>
      <Form.Group size="lg" controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control
          autoFocus
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </Form.Group>
      <Form.Group size="lg" controlId="location">
        <Form.Label>Latitude</Form.Label>
        <Form.Control
          autoFocus
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <Form.Label>Longitude</Form.Label>
        <Form.Control
          autoFocus
          type="number"
          value={long}
          onChange={(e) => setLong(e.target.value)}
        />
      </Form.Group>
      <Form.Group size="lg" controlId="realtor">
        <DropdownButton
          variant="outline-dark"
          title={realtor?.name || "Realtor"}
          id="input-group-dropdown"
        >
          {realtors.map(realtor => (
            <Dropdown.Item value={realtor.name} onClick={() => setRealtor(realtor)}>
              {realtor.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Form.Group>
    </Form>
  )
}

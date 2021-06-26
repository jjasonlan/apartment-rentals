import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import './GridView.css';

export default function GridView (props) {
  return (
    <div className='grid-container'>
      <div>Home</div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Floor Area Size</th>
            <th>Price Per Month</th>
            <th>Rooms</th>
            <th>Location</th>
            <th>Date Added</th>
            <th>Realtor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dolores Park</td>
            <td>Park in Sunny San Francisco</td>
            <td>1000 sqft.</td>
            <td>$4000</td>
            <td>6</td>
            <td>(37.759703, -122.428093)</td>
            <td>{new Date().toString()}</td>
            <td>Mark Otto</td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

import React, { useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import './Map.css';

function MapElement(props) {
  const { apartments } = props;
  const [activeMarker, setActiveMarker] = useState({});
  const [showingInfoWindow, setShowingInfoWindow] = useState('');

  const onClickMarker = (props, marker, e) => {
    setActiveMarker(marker);
    setShowingInfoWindow(marker.name);
  }

  return (
    <div className='map-container'>
      <h3>Map</h3>
      <Map
        google={props.google}
        zoom={14}
        style={
          {
            height: '100%',
            width: '100%',
          }
        }
        initialCenter={{lat: 37.759703, lng: -122.428093}}
      >
        {apartments.map(apartment => (
          <Marker
            name={apartment.name}
            position={{lat: apartment.location[0], lng: apartment.location[1]}}
            onClick={onClickMarker}
            {...apartment}
          >
          </Marker>
        ))}
        <InfoWindow visible={showingInfoWindow === activeMarker.name} marker={activeMarker}>
          <div>
            <h4>{activeMarker.name}</h4>
            <p>{activeMarker.description}</p>
            <p>{activeMarker.rooms} {activeMarker.rooms === 1 ? 'room' : 'rooms'}, ${activeMarker.price}/mo</p>
          </div>
        </InfoWindow>
      </Map>
    </div>
  )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBZW11Y7ZCDTPemF-86CkqUQItv-vDZN0Q'
})(MapElement);

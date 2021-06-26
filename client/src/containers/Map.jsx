import React, { useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import './Map.css';

function MapElement(props) {
  const [selectedPlace, setSelectedPlace] = useState({});
  const [activeMarker, setActiveMarker] = useState({});
  const [showingInfoWindow, setShowingInfoWindow] = useState('');

  const onClickMarker = (props, marker, e) => {
    console.log({props, marker})
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(marker.name);
  }

  return (
    <div className='map-container'>
      <div>Map</div>
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
        <Marker
          name={'Dolores park'}
          position={{lat: 37.759703, lng: -122.428093}}
          onClick={onClickMarker}
        />
          <InfoWindow visible={showingInfoWindow === activeMarker.name} marker={activeMarker}>
            <div>
              <h1>{activeMarker.name}</h1>
            </div>
          </InfoWindow>
      </Map>
    </div>
  )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBZW11Y7ZCDTPemF-86CkqUQItv-vDZN0Q'
})(MapElement);

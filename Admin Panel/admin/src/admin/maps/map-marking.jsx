import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './MapComponent.css'; // Import the CSS file

// URL for red and green marker icons
const RED_MARKER_URL = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
const GREEN_MARKER_URL = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = () => {
  const center = { lat: 12.7409, lng: 77.8253 }; // Centered to view all three cities

  // State for managing locations and their car availability
  const [locations, setLocations] = useState([
    { name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, car: false },
    { name: 'Magarpatta Pune', latitude: 18.5148, longitude: 73.9260, car: false },
    { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, car: false },
    { name: 'Vijayawada', latitude: 16.5062, longitude: 80.6480, car: false },
    { name: 'Kurnool', latitude: 15.8281, longitude: 78.0373, car: false },
    { name: 'Mysuru', latitude: 12.2958, longitude: 76.6394, car: false },
  ]);

  // State for toggling the side navbar
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Simulate booking a car at a specific index
  const bookCar = (index) => {
    setLocations((prevLocations) => {
      const updatedLocations = [...prevLocations];
      updatedLocations[index].car = true; // Change car flag to true
      return updatedLocations;
    });
  };

  return (
    <div className="map-component">
      <button className="nav-toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
        ☰
      </button>
      <div className={`side-navbar ${isNavOpen ? 'open' : ''}`}>
        <div className="navbar-content">
          {locations.map((location, index) => (
            <button
              key={index}
              onClick={() => bookCar(index)}
              className="booking-button"
            >
              Book Car in {location.name}
            </button>
          ))}
        </div>
      </div>
      <div className="map-container">
        <h2 className="map-title">Car Locations on the Map</h2>
        <LoadScript googleMapsApiKey="AIzaSyAQbctCGAqcMI0lLmid4I7LJxYl7PLP5H8"> {/* Replace with your API key */}
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
          >
            {locations.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={location.car ? GREEN_MARKER_URL : RED_MARKER_URL}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default MapComponent;

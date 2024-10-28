// pages/index.js
import { MapComponent } from '@/components/map';
import React from 'react';


const HomePage = () => {
  // Replace with your destination coordinates
  const destination = { lat: 37.7749, lng: -122.4194 };

  return (
    <div>
      <h1>Map Directions</h1>
      <MapComponent destination={destination} />
    </div>
  );
};

export default HomePage;

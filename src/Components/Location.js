import React from 'react';
import { usePosition } from 'use-position';

const Location = () => {
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(true);

  const handleClick = () => {
    console.log('location button was clicked');
    const locationDiv = document.getElementById('location');
    locationDiv.style.display = 'block';
  };

  return (
    <div>
      <h5>
        <b>Where are you located?</b>
      </h5>
      <button onClick={handleClick}>
        <h5>Locate me!</h5>
      </button>
      <div id='location' style={{ display: 'none' }}>
        You are located at Latitude {latitude} and longitude {longitude}
      </div>
    </div>
  );
};

export default Location;

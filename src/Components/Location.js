import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Location = ({ location, setLocation }) => {
  const [showButton, setShowButton] = useState(true);
  const [prettyLocation, setPrettyLocation] = useState([]);

  useEffect(() => {
    const lat = location[0];
    const long = location[1];

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}
    &result_type=street_address&key=AIzaSyCUxDqDqR3PMKAaiBglCz62PAxiRu_evTk`
      )
      .then((results) => {
        let city = results.data.results[0].address_components[3].short_name;
        let state = results.data.results[0].address_components[5].short_name;
        let zip = results.data.results[0].address_components[7].short_name;
        let locationString = `${city}, ${state} ${zip}`;
        setPrettyLocation(locationString);
      });
  }, [location]);

  const handleClick = () => {
    getLocation();
    setShowButton(!showButton);
    // need some kind of preloader here while it waits
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      return 'Geolocation is not supported by this browser.';
    }
  };

  const showPosition = (position) => {
    const userPosition = [
      position.coords.latitude.toFixed(7),
      position.coords.longitude.toFixed(7),
    ];
    setLocation(userPosition);
  };

  return (
    <div>
      <h5>
        <b>Where are you located?</b>
      </h5>
      <button
        type="button"
        onClick={handleClick}
        style={{ display: showButton ? 'inline-block' : 'none' }}
      >
        <h5>Locate me!</h5>
      </button>
      <div id="location">{prettyLocation}</div>
    </div>
  );
};

export default Location;

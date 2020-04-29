import React, { useState, useEffect } from 'react';
import axios from 'axios';

////////////////LOCATION BUGS//////////////////////
// -- If location isn't found, preloader spins forever and user has no
//    other options (maybe add a try catch that allows for zip code entry)
// -- If add zip code entry, use Google API for geocoding to translate zip
//    to GPS coordinates and add that to user table
// -- Possibly just add zip code option for everyone if they decline
//    location services
// -- Try to get rid of failed network request that shows in console when
//    navigating to create user page
// -- NOT LOCATION RELATED BUT.... can we auto log in/redirect once user is
//    created?

// RESOLVED
// -- If not all 7 pieces returns from reverse geolocation, user info gets input
//    incorrecly (look at current solution - had some odd effects on deployed
//    version - maybe use the "type" property to make sure we are getting
//    the correct location type
//    )

const Location = ({ location, setLocation }) => {
  const [showButton, setShowButton] = useState(true);
  const [prettyLocation, setPrettyLocation] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const lat = location[0];
    const long = location[1];

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}
    &result_type=street_address&key=AIzaSyCUxDqDqR3PMKAaiBglCz62PAxiRu_evTk`
      )
      .then((results) => {
        let addressResults = results.data.results[0].address_components;
        console.log('address results are', addressResults);
        const cityResult = addressResults.filter(
          (result) => result.types.includes('locality') === true
        );
        const stateResult = addressResults.filter(
          (result) =>
            result.types.includes('administrative_area_level_1') === true
        );
        const zipResult = addressResults.filter(
          (result) => result.types.includes('postal_code') === true
        );

        let city = cityResult[0].short_name;
        let state = stateResult[0].short_name;
        let zip = zipResult[0].short_name;
        let locationString = `${city}, ${state} ${zip}`;
        setPrettyLocation(locationString);
        setIsSubmitted(true);
        setIsLoading(false);
      })
      .catch((err) => {
        if (location.length > 0) {
          setIsLoading(false);
          setErrorMsg(
            'Sorry, location could not be determined. Please enter a zip code instead.'
          );
          setHasError(true);
        }
      });
  }, [location]);

  const handleClick = () => {
    setIsLoading(true);
    getLocation();
    setShowButton(!showButton);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, locError);
    } else {
      setIsLoading(false);
      setHasError(true);
      setErrorMsg(
        'Sorry, location could not be determined. Please enter a zip code instead.'
      );
    }
  };

  const locError = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setIsLoading(false);
    setHasError(true);
    setErrorMsg(
      'Sorry, location could not be determined. Please enter a zip code instead.'
    );
  };

  const showPosition = (position) => {
    const userPosition = [
      position.coords.latitude.toFixed(7),
      position.coords.longitude.toFixed(7),
    ];
    setLocation(userPosition);
  };

  const handleZip = (e) => {
    const zipInput = e.target.value;
    if (zipInput.length === 5) {
      console.log(e.target.value);
      // This is where I stopped, need to geolocate zip and set to location state
    }
  };

  return (
    <div>
      <h5>
        <b>Where are you located?</b>
      </h5>
      <button
        id="locationButton"
        type="button"
        onClick={handleClick}
        style={{ display: showButton ? 'inline-block' : 'none' }}
      >
        <h5>Locate me!</h5>
      </button>
      {/* <div>
        Or, add a zip code instead.
        <input />
      </div> */}

      {isLoading && (
        <div className="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {isSubmitted && (
        <div id="location">
          {prettyLocation} <img id="small-check" src="./assets/check.png" />
        </div>
      )}
      {hasError && (
        <div id="zip">
          {errorMsg}
          <input
            type="text"
            pattern="[0-9]*"
            maxLength="5"
            placeholder="Zip Code"
            onChange={handleZip}
          />
        </div>
      )}
    </div>
  );
};

export default Location;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Location = ({ location, setLocation }) => {
  const [showButton, setShowButton] = useState(true);
  const [prettyLocation, setPrettyLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [userZip, setUserZip] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const lat = location[0];
    const long = location[1];

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}
    &result_type=street_address&key=AIzaSyB6t8sOhNrUAme5F7mx0NdTSeGhmYCxUL4`
      )
      .then((results) => {
        console.log('google api reverse geolocation', results);
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
        console.warn(err);
        if (location.length > 0) {
          setIsLoading(false);
          setHasError(true);
        }
      });
  }, [location]);

  useEffect(() => {
    axios
      .get(
        `https://open.mapquestapi.com/geocoding/v1/address?key=gQoK5fh8GLGbempuLj7nGzwFX879y7Ot&location=${userZip}`
      )
      .then((results) => {
        console.log(results.data.results[0].locations[0].displayLatLng);
        let latFromZip = results.data.results[0].locations[0].displayLatLng.lat;
        let longFromZip =
          results.data.results[0].locations[0].displayLatLng.lng;
        console.log(latFromZip);
        console.log(longFromZip);
        setLocation([latFromZip, longFromZip]);
      });
  }, [userZip]);

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
    }
  };

  const locError = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setIsLoading(false);
    setHasError(true);
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
      setUserZip(zipInput);
    }
  };

  return (
    <div>
      <button
        id="locationButton"
        type="button"
        onClick={handleClick}
        style={{ display: showButton ? 'inline-block' : 'none' }}
      >
        <h5>Locate me!</h5>
      </button>
      {isLoading && (
        <div className="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {isSubmitted && (
        <div
          id="location"
          style={{ display: userZip.length < 5 ? 'inline-block' : 'none' }}
        >
          {prettyLocation} <img id="small-check" src="./assets/check.png" />
        </div>
      )}
      {hasError && (
        <div id="zip">
          Sorry, location could not be determined. Please enter a zip code
          instead.
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

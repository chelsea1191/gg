import React from 'react';
import { usePosition } from 'use-position';

// truncate gps coordinates? or doesnt matter bc will not show them that
// fix it so that it doesnt pull locatino until you click button
// fix so that form doesnt submit until you hit submit (currently submitting when you hit locate me )
// get gps coordinates translated to city or zip
// store gps coordinates in db
// Next: google maps for stores

// BUGS i've noticed
// nav bar looks like its been squished - was previously working

// To discuss with group
// Trello - user stories that we can move through from planned/in progress/QA/complete like with GS?
// Trello - category for bugs, as we notice them we can add them and then start working through them as we can

const Location = () => {
  const { latitude, longitude, timestamp, accuracy, error } = usePosition();

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

import React from 'react';

const About = () => {
  const greentext = { color: 'rgb(0, 200, 0)' };
  return (
    <div id="aboutPage">
      <h3>
        Developed by <span style={greentext}>Team Awesome</span>
      </h3>
      <p>
        <b style={greentext}>gg</b> allows users to connect with people near
        them to play games.
      </p>
    </div>
  );
};

export default About;

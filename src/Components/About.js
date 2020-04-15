import React from 'react';

const About = () => {
  const greentext = { color: 'rgb(0, 200, 0)' };
  return (
    <div id="aboutPage">
      <h3>
        Developed by <span style={greentext}>Team Awesome</span>
      </h3>
      <hr className="hr" />
      <p>
        <b style={greentext}>gg</b> allows users to connect with people near
        them to play games.
      </p>
      <p>Add your Favorite Games to your profile from the Games page.</p>
      <p>
        Use the Home page to search for other users in your area based on their
        Favorite Games
      </p>
      <p>View their profiles to become Friends and chat!</p>
    </div>
  );
};

export default About;

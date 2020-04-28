import React from 'react';
import Loading from './Loading';

const About = () => {
  const greentext = { color: 'rgb(0, 200, 0)' };

  const icon = { fontSize: 16, color: 'rgba(150,150,150,1)' };

  return (
    <div>
      <div id="aboutPage">
        <h3>
          Developed by <span style={greentext}>Team Awesome</span>
        </h3>
        <hr className="hr" />
        <p>
          <b style={greentext}>gg</b> allows users to connect with people near
          them to play games.
        </p>
        <p>
          Add your Favorite Games to your profile from the Games page{' '}
          <i className="fas fa-dice-d20 each-icon-dashboard" style={icon}></i>.
        </p>
        <p>
          Use the Home page to search for other users in your area based on
          their Favorite Games
        </p>
        <p>View their profiles to become Friends and chat!</p>
      </div>
    </div>
  );
};

export default About;

//add github link

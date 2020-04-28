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
          them to play games together.
        </p>
        <p>
          Add your favorite games from the Games page.{' '}
          <i className="fas fa-dice-d20 each-icon-dashboard" style={icon}></i>
        </p>
        <p>
          Find users in your area who play the same games on the Search page.{' '}
          <img
            src="/assets/find.png"
            alt=""
            width="16"
            height="16"
            title="Find Players"
          ></img>
        </p>
        <p>
          View their profiles to become friends and chat!{' '}
          <img
            id="chatButton"
            src="/assets/chat.png"
            alt=""
            width="16"
            height="16"
            title="Chat"
          ></img>
        </p>
      </div>
    </div>
  );
};

export default About;

//add github link

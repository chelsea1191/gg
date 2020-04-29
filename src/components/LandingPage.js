import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const LandingPage = () => {
  const greentext = { color: 'rgb(0, 200, 0)' };

  return (
    <div id="guestRestricted">
      <h3>Welcome</h3>
      <hr className="hr" />
      <div className="icon-container">
        {' '}
        <i className="fas fa-2x fa-hat-wizard each-icon"></i>
        <i className="fas fa-2x fa-gamepad each-icon"></i>
        <i className="fas fa-2x fa-dice each-icon"></i>
      </div>
      <p>
        <b style={greentext}>gg</b> works best with lots of active users.
      </p>
      <p>
        {' '}
        Current Users Login{' '}
        <Link className="link" to="/login">
          <b style={greentext}>Here</b>
        </Link>
      </p>
      <br />
      <hr className="hr" />
      <h4>Not a member yet?</h4>
      <p>
        Browse our supported{' '}
        <Link className="link" to="/games">
          <b style={greentext}>Games</b>
        </Link>
      </p>
      <p>
        {' '}
        <Link className="link" to="/register">
          <b style={greentext}>Create a Profile</b>{' '}
        </Link>
        to start connecting!{' '}
      </p>
    </div>
  );
};

export default LandingPage;

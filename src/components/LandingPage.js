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
    <div id='guestRestricted'>
      <h3>
        Welcome to <b style={greentext}>gg</b>!
      </h3>{' '}
      <hr className='hr' />
      <div className='icon-container'>
        {' '}
        <i className='fas fa-2x fa-hat-wizard each-icon'></i>
        <i className='fas fa-2x fa-gamepad each-icon'></i>
        <i className='fas fa-2x fa-dice each-icon'></i>
      </div>
      <p>
        <b style={greentext}>gg</b> works best with lots of active users.
      </p>
      <p>
        {' '}
        Current users can login{' '}
        <Link className='link' to='/login'>
          here
        </Link>
      </p>
      <hr className='hr' />
      <h4>Not a member yet?</h4>
      <p>
        Feel free to browse our list of supported games{' '}
        <Link className='link' to='/games'>
          here
        </Link>
      </p>
      <p>
        {' '}
        <Link className='link' to='/register'>
          Create a Profile{' '}
        </Link>
        and start finding people to play with!{' '}
      </p>
    </div>
  );
};

export default LandingPage;

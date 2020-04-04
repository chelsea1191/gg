import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './Components/Home.js';
import Search from './Components/Search.js';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const App = () => {
  useEffect(() => {
    console.log('App is connected');
  }, []);

  return (
    <div className='App'>
      <Router>
        <div>
          <nav className='navbar navbar-expand-lg navbar-light'>
            <li className='nav-link active'>
              <Link className='link' to='/'>
                <img
                  src='/assets/home.png'
                  alt=''
                  width='32'
                  height='32'
                  title='Bootstrap'></img>
              </Link>
            </li>
            <li className='nav-link'>
              <Link className='link' to='/search'>
                <img
                  src='/assets/search.png'
                  alt=''
                  width='32'
                  height='32'
                  title='Bootstrap'></img>
              </Link>
            </li>
          </nav>
          <hr />
          <Switch>
            <Route path='/search'>
              <Search />
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
      <div className='media'>
        <p className='mt-0'>developed by: </p>
      </div>
    </div>
  );
};

export default App;

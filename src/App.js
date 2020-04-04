import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import Home from './Components/Home.js';
import Search from './Components/Search.js';
import Login from './Components/Login';
import CreateUser from './Components/CreateUser';
import UserProfile from './Components/UserProfile';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const headers = () => {
  const token = window.localStorage.getItem('token');
  return {
    headers: {
      authorization: token
    }
  };
};

const App = () => {
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));
  const [auth, setAuth] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (credentials) => {
    const token = (await axios.post('/api/auth', credentials)).data.token;
    window.localStorage.setItem('token', token);
    exchangeTokenForAuth();
  };

  const exchangeTokenForAuth = async () => {
    const response = await axios.get('/api/auth', headers());
    setAuth(response.data);
    if (response.data.role === 'admin') {
      console.log('logged in! user is an admin');
      setIsAdmin(true);
    }
    if (response.data.role === 'player') {
      console.log('logged in! user is a player');
    }
  };

  const logout = () => {
    window.location.hash = '#';
    window.localStorage.removeItem('token');
    setAuth({});
    setIsAdmin(false);
    console.log('user has been logged out');
  };

  const changePassword = (newCredentials) => {
    axios.put(`/api/auth/${auth.id}`, newCredentials);
  };

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  useEffect(() => {
    exchangeTokenForAuth();
  }, []);

  if (!auth.id) {
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
                <Link className='link' to='/login'>
                  Login
                </Link>
              </li>
              <li className='nav-link'>
                <Link className='link' to='/register'>
                  Register
                </Link>
              </li>
            </nav>
            <hr />
            <Switch>
              <Route path='/login'>
                <Login login={login} />
              </Route>
              <Route path='/register'>
                <CreateUser auth={auth} setAuth={setAuth} />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  } else {
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
                <Link className='link' to='/userprofile'>
                  User Profile
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
              <li className='nav-link'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={logout}>
                  Logout
                </button>
              </li>
            </nav>
            <hr />
            <Switch>
              <Route path='/search'>
                <Search />
              </Route>
              <Route path='/userprofile'>
                <UserProfile auth={auth} changePassword={changePassword} />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
};

export default App;

import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';
import FindPlayers from './components/FindPlayers.js';
import GamesPage from './components/GamesPage';
import GamePage from './components/GamePage';
import UserProfile from './components/UserProfile';
import About from './components/About';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import UserFriendsPage from './components/UserFriendsPage';
import UserGamesPage from './components/UserGamesPage';
import UserSettings from './components/UserSettings';
import LandingPage from './components/LandingPage';
import Chat from './components/chat/Chat';
import UserChat from './components/chat/UserChat';
import Loading from './components/Loading';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import 'react-bootstrap-typeahead/css/Typeahead.css'; //icon
import 'react-toastify/dist/ReactToastify.css';

const headers = () => {
  const token = window.localStorage.getItem('token');
  return {
    headers: {
      authorization: token,
    },
  };
};

const App = () => {
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1))); //remove?
  const [auth, setAuth] = useState({});
  const [isAdmin, setIsAdmin] = useState(false); //remove?
  const [allGames, setAllGames] = useState([]);
  const [gameView, setGameView] = useState([]);
  const [userView, setUserView] = useState([]);
  const [friendsView, setFriendsView] = useState([]); //remove?
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [friendships, setFriendships] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [userFriends, setUserFriends] = useState([]); //remove?
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    axios.get('/api/games').then((response) => {
      setAllGames(response.data);
    });
  }, [auth]);

  useEffect(() => {
    axios.get('/api/users').then((response) => {
      setUsers(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/favoritegames').then((response) => {
      setFavoriteGames(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/friendships').then((response) => {
      setFriendships(response.data);
    });
  }, []);

  const login = async (credentials) => {
    const token = (await axios.post('/api/auth', credentials)).data.token;
    window.localStorage.setItem('token', token);
    exchangeTokenForAuth();
  };

  const exchangeTokenForAuth = async () => {
    const response = await axios.get('/api/auth', headers());
    console.log(response, 'this is the exchange for token');
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
    window.localStorage.removeItem('filtered');
    window.localStorage.removeItem('results');
    axios.put(`/api/auth/logout/${auth.id}`);
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

  const icon = { fontSize: 24, color: 'rgba(255,255,255,0.5)', margin: 0 };

  window.onload = function () {
    if (/iP(hone|ad)/.test(window.navigator.userAgent)) {
      document.body.addEventListener('touchstart', function () { }, false);
    }
  };

  if (!auth.id) {
    return (
      <div className='App'>
        <Router>
          <div>
            <div id='nav'>
              <nav className='navbar navbar-expand-lg navbar-light'>
                <li className='nav-icon'>
                  <Link className='link' to='/'>
                    <img
                      id='navLogo'
                      src='/assets/logo.png'
                      alt=''
                      title='Home'></img>
                  </Link>
                </li>
                <li className='nav-icon'>
                  <Link className='link' to='/games'>
                    <i
                      className='fas fa-dice-d20 each-icon-dashboard'
                      style={icon}></i>
                  </Link>
                </li>
                <li className='nav-icon'>
                  <Link className='link' to='/about'>
                    <img
                      src='/assets/about.png'
                      alt=''
                      width='24'
                      height='24'
                      title='About'></img>
                  </Link>
                </li>
                <li className='nav-icon'>
                  <Link className='link' to='/login'>
                    <button id='logButton'>
                      <img
                        alt=''
                        src='/assets/power.png'
                        width='13'
                        height='15'
                        title='Login'
                      />
                      <h6>Login</h6>
                    </button>
                  </Link>
                </li>
              </nav>
            </div>
            <div id='view'>
              <Switch>
                <Route path='/login'>
                  <Login login={login} />
                </Route>
                <Route path='/register'>
                  <CreateUser
                    auth={auth}
                    setAuth={setAuth}
                    allGames={allGames}
                    favoriteGames={favoriteGames}
                    setFavoriteGames={setFavoriteGames}
                  />
                </Route>
                <Route exact path={`/games/${gameView.id}`}>
                  <GamePage
                    game={gameView}
                    auth={auth}
                    favoriteGames={favoriteGames}
                    setFavoriteGames={setFavoriteGames}
                  />
                </Route>

                <Route path='/games'>
                  <GamesPage
                    auth={auth}
                    favoriteGames={favoriteGames}
                    setFavoriteGames={setFavoriteGames}
                    allGames={allGames}
                    setGameView={setGameView}
                  //favoriteGames={favoriteGames}
                  //setFavoriteGames={setFavoriteGames}
                  />
                </Route>
                <Route path='/about'>
                  <About />
                </Route>
                <Route path='/'>
                  <LandingPage />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      </div>
    );
  } else {
    return (
      <div className='App'>
        <Router>
          <div>
            <div id='nav'>
              <nav className='navbar navbar-expand-lg navbar-light'>
                <li className='nav-icon'>
                  <Link className='link' to='/'>
                    <img
                      id='navLogo'
                      src='/assets/logo.png'
                      alt=''
                      title='Home'></img>
                  </Link>
                </li>
                <div className='vl'></div>
                <li className='nav-icon'>
                  <Link className='link' to='/games'>
                    <i
                      className='fas fa-dice-d20 each-icon-dashboard'
                      style={icon}></i>
                  </Link>
                </li>
                <li className='nav-icon'>
                  <Link className='link' to='/findplayers'>
                    <img
                      src='/assets/find.png'
                      alt=''
                      width='24'
                      height='24'
                      title='Find Players'></img>
                  </Link>
                </li>
                <li className='nav-icon'>
                  <Link className='link' to='/chat'>
                    <img
                      id='chatButton'
                      src='/assets/chat.png'
                      alt=''
                      width='24'
                      height='24'
                      title='Chat'></img>
                  </Link>
                </li>
                <li className='nav-icon'>
                  <Link className='link' to='/usersettings'>
                    <img
                      src='/assets/settings.png'
                      alt=''
                      width='24'
                      height='24'
                      title='Settings'></img>
                  </Link>
                </li>
                <li className='nav-icon'>
                  <Link className='link' to='/about'>
                    <img
                      src='/assets/about.png'
                      alt=''
                      width='24'
                      height='24'
                      title='About'></img>
                  </Link>
                </li>
                <li className='nav-icon'>
                  <Link className='link' to='/login'>
                    <button type='button' id='logButton' onClick={logout}>
                      <img
                        alt=''
                        src='/assets/power.png'
                        width='13'
                        height='15'
                        title='Logout'
                      />
                      <h6>Log Out</h6>
                    </button>
                  </Link>
                </li>
              </nav>
            </div>
            <div id='view'>
              <Switch>
                <Route exact path={`/games/${gameView.id}`}>
                  <GamePage
                    game={gameView}
                    auth={auth}
                    favoriteGames={favoriteGames}
                    setFavoriteGames={setFavoriteGames}
                  />
                </Route>
                <Route exact path={`/users/${userView.id}/friends`}>
                  <UserFriendsPage
                    users={users}
                    user={userView}
                    friendships={friendships}
                    setFriendships={setFriendships}
                    setUserView={setUserView}
                  />
                </Route>
                <Route exact path={`/users/${userView.id}/favoriteGames`}>
                  <UserGamesPage
                    user={userView}
                    allGames={allGames}
                    favoriteGames={favoriteGames}
                    setFavoriteGames={setFavoriteGames}
                    auth={auth}
                    setGameView={setGameView}
                  />
                </Route>
                <Route exact path={`/users/${userView.id}`}>
                  <UserProfile
                    user={userView}
                    setFriendsView={setFriendsView}
                    favoriteGames={favoriteGames}
                    allGames={allGames}
                    friendships={friendships}
                    setFriendships={setFriendships}
                    users={users}
                    auth={auth}
                    setAuth={setAuth}
                  />
                </Route>
                <Route path='/games'>
                  <GamesPage
                    auth={auth}
                    allGames={allGames}
                    setGameView={setGameView}
                    favoriteGames={favoriteGames}
                    setFavoriteGames={setFavoriteGames}
                  />
                </Route>
                <Route path='/usersettings'>
                  <UserSettings
                    auth={auth}
                    setAuth={setAuth}
                    changePassword={changePassword}
                    setUserView={setUserView}
                    users={users}
                    setUsers={setUsers}
                    location={location}
                    setLocation={setLocation}
                  />
                </Route>
                <Route path='/about'>
                  <About />
                </Route>

                <Route
                  exact
                  path='/chat'
                  component={(props) => {
                    return <Chat {...props} auth={auth} />;
                  }}></Route>
                <Route
                  exact
                  path='/chat/:id'
                  component={(props) => {
                    return (
                      <UserChat
                        {...props}
                        auth={auth}
                        users={users}
                        setUserView={setUserView}
                      />
                    );
                  }}></Route>
                <Route path='/findplayers'>
                  <FindPlayers
                    allGames={allGames}
                    users={users}
                    user={user}
                    setUser={setUser}
                    auth={auth}
                    allGames={allGames}
                    setUserView={setUserView}
                    setGameView={setGameView}
                  //favoriteGames={favoriteGames}
                  />
                </Route>
                <Route path='/'>
                  <Dashboard
                    auth={auth}
                    friendships={friendships}
                    users={users}
                  />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      </div>
    );
  }
};

export default App;

//maybe add to improve user experience: upon page load, if user is NOT on mobile, alert and say "this site is best viewable on a mobile device but proceed as everything should still work"

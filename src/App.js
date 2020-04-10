import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import FindPlayers from './Components/FindPlayers.js';
import GamesPage from './Components/GamesPage';
import GamePage from './Components/GamePage';
import About from './Components/About';
import Login from './Components/Login';
import CreateUser from './Components/CreateUser';
import UserSettings from './Components/UserSettings';
import Chat from './Components/Chat';
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
  const [allGames, setAllGames] = useState([]);
  const [gameView, setView] = useState([]);

  //for the chat to get the users
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);

  // useEffect(() => {
  //   axios.get('/api/users').then(response => {
  //     console.log('all users: ', response.data);
  //     setUsers(response.data);
  //   });
  // }, [auth]);

  useEffect(() => {
    axios.get('/api/games').then(response => {
      //console.log('all games: ', response.data);
      setAllGames(response.data);
    });
  }, [auth]);

  useEffect(() => {
    axios.get('/api/users').then(response => {
      setUsers(response.data);
    });
  }, []);

  const login = async credentials => {
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

  const changePassword = newCredentials => {
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
      <div className="App">
        <Router>
          <div id="nav">
            <nav className="navbar navbar-expand-lg navbar-light">
              <li className="nav-link active">
                <Link className="link" to="/">
                  <img
                    id="navLogo"
                    src="/assets/logo.png"
                    alt=""
                    title="Bootstrap"
                  ></img>
                </Link>
              </li>
              <li className="nav-link">
                <Link className="link" to="/games">
                  <img
                    src="/assets/search.png"
                    alt=""
                    width="24"
                    height="24"
                    title="Bootstrap"
                  ></img>
                </Link>
              </li>

              <li className="nav-link">
                <Link className="link" to="/about">
                  <img
                    src="/assets/about.png"
                    alt=""
                    width="24"
                    height="24"
                    title="Bootstrap"
                  ></img>
                </Link>
              </li>
              <li className="nav-link">
                <Link className="link" to="/login">
                  <button className="btn btn-secondary">Login</button>
                </Link>
              </li>
            </nav>
            <hr />
            <Switch>
              <Route path="/login">
                <Login login={login} />
              </Route>

              <Route path="/register">
                <CreateUser auth={auth} setAuth={setAuth} />
              </Route>
              <Route exact path={`/games/${gameView.id}`}>
                <GamePage game={gameView} />
              </Route>
              <Route path="/games">
                <GamesPage allGames={allGames} setView={setView} />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/">
                <FindPlayers
                  users={users}
                  user={user}
                  setUsers={setUser}
                  auth={auth}
                />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-light">
              <li className="nav-link active">
                <Link className="link" to="/">
                  <img
                    id="navLogo"
                    src="/assets/logo.png"
                    alt=""
                    title="Bootstrap"
                  ></img>
                </Link>
              </li>
              <li className="nav-link">
                <Link className="link" to="/games">
                  <img
                    src="/assets/search.png"
                    alt=""
                    width="24"
                    height="24"
                    title="Bootstrap"
                  ></img>
                </Link>
              </li>
              <li className="nav-link">
                <Link className="link" to="/usersettings">
                  <img
                    src="/assets/settings.png"
                    alt=""
                    width="24"
                    height="24"
                    title="Bootstrap"
                  ></img>
                </Link>
              </li>

              <li className="nav-link">
                <Link className="link" to="/about">
                  <img
                    src="/assets/about.png"
                    alt=""
                    width="24"
                    height="24"
                    title="Bootstrap"
                  ></img>
                </Link>
              </li>
              <li className="nav-link">
                <Link className="link" to="/chat">
                  <button className="btn btn-secondary">Chat</button>
                </Link>
              </li>
              <li className="nav-link">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </nav>
            <hr />
            <Switch>
              <Route exact path={`/games/${gameView.id}`}>
                <GamePage game={gameView} />
              </Route>
              <Route path="/games">
                <GamesPage allGames={allGames} setView={setView} />
              </Route>
              <Route path="/usersettings">
                <UserSettings auth={auth} changePassword={changePassword} />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/chat">
                <Chat
                  auth={auth}
                  users={users}
                  user={user}
                  setUsers={setUser}
                />
              </Route>
              <Route path="/">
                <FindPlayers
                  users={users}
                  user={user}
                  setUser={setUser}
                  auth={auth}
                />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
};

export default App;

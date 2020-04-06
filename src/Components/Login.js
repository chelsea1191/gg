import React, { useState, useEffect } from 'react';

// LANDING PAGE WHEN APP OPENS.
// WHEN USER LOGS IN OR BROWSES AS GUEST, LINKS TO FIND PLAYERS PAGE

const Login = ({ login }) => {
  const greentext = { color: 'rgb(0, 200, 0)' };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onSubmit = (ev) => {
    ev.preventDefault();
    login({ username, password }).catch((ex) =>
      setError(ex.response.data.message)
    );
  };
  return (
    <div id="loginPage">
      <img id="loginLogo" src="../../assets/logo.png" />
      <form id="loginForm" onSubmit={onSubmit}>
        <div className="error">{error}</div>
        <input
          type="text"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="Password"
        />
        <button id="loginButton">
          <h5>Login</h5>
        </button>
        <h6>
          <a href="/register" style={greentext}>
            <b>Create a Profile</b>
          </a>
        </h6>
        <h6>or Browse as a Guest</h6>
      </form>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';

// LANDING PAGE WHEN APP OPENS.
// WHEN USER LOGS IN OR BROWSES AS GUEST, LINKS TO FIND PLAYERS PAGE

const Login = ({ login }) => {
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
    <form id="loginForm" onSubmit={onSubmit}>
      <h1>gg</h1>
      <div className="error">{error}</div>
      <input
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
        <a href="">Browse as a Guest</a>
      </h6>
    </form>
  );
};

export default Login;

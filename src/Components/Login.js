import React, { useState, useEffect } from 'react';

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
      <input value={username} onChange={(ev) => setUsername(ev.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button id="loginButton">Login</button>
      <a href="">Browse as a Guest</a>
    </form>
  );
};

export default Login;

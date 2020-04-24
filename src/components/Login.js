import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

// LANDING PAGE WHEN APP OPENS.
// WHEN USER LOGS IN OR BROWSES AS GUEST, LINKS TO FIND PLAYERS PAGE

const Login = ({ login }) => {
  const greentext = { color: 'rgb(0, 200, 0)' }
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const onSubmit = (ev) => {
    ev.preventDefault()
    login({ username, password }).catch((ex) =>
      setError(ex.response.data.message)
    )
  }
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
          <Link className="link" to="/register">
            <h6>Create Profile</h6>
          </Link>
        </h6>
        <h6>
          <i>or Browse as a Guest</i>
        </h6>
      </form>
      <h6>© Team Awesome</h6>
    </div>
  )
}

export default Login

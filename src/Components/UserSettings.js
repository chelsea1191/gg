import React, { useState } from 'react';
import axios from 'axios';

const UserProfile = ({ auth, changePassword }) => {
  const [firstpass, setfirstpass] = useState('');
  const [secondpass, setsecondpass] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const onPassSubmit = (ev) => {
    ev.preventDefault();
    if (firstpass === secondpass) {
      setIsSuccessful(true);
      changePassword({ userId: auth.id, password: firstpass });
    }
    setfirstpass('');
    setsecondpass('');
  };

  return (
    <div id="userSettingsPage" className="prod-container">
      <div id="userSettingsInfo">
        <h6>
          <b>First Name: </b>
          {auth.firstname}
        </h6>
        <h6>
          <b>Last Name: </b>
          {auth.lastname}
        </h6>
        <h6>
          <b>Username: </b>
          {auth.username}
        </h6>
      </div>

      <form id="changePasswordForm" onSubmit={onPassSubmit}>
        <h4>Change Password</h4>
        <input
          type="password"
          placeholder="new password"
          value={firstpass}
          onChange={(ev) => setfirstpass(ev.target.value)}
        />
        <input
          type="password"
          placeholder="confirm new password"
          value={secondpass}
          onChange={(ev) => setsecondpass(ev.target.value)}
        />
        <button type="submit">
          <h5>Submit Change</h5>
        </button>
        {isSuccessful && (
          <p className="alert alert-success" role="alert">
            password successfully changed!
          </p>
        )}
      </form>
    </div>
  );
};

export default UserProfile;

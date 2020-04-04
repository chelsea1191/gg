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
    <div className='prod-container'>
      <h4>First Name: {auth.firstname}</h4>
      <h4>Last Name: {auth.lastname}</h4>
      <h4>Username: {auth.username}</h4>
      <br />
      <h3>Change Password</h3>
      <form onSubmit={onPassSubmit}>
        <input
          type='password'
          placeholder='new password'
          value={firstpass}
          onChange={(ev) => setfirstpass(ev.target.value)}
        />
        <input
          type='password'
          placeholder='confirm new password'
          value={secondpass}
          onChange={(ev) => setsecondpass(ev.target.value)}
        />
        <button type='submit'>Submit Password Change</button>
        {isSuccessful && (
          <p className='alert alert-success' role='alert'>
            password successfully changed!
          </p>
        )}
      </form>
    </div>
  );
};

export default UserProfile;

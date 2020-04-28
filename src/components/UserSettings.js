import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import FileUpload from './FileUpload';

const UserProfile = ({
  auth,
  changePassword,
  setUserView,
  users,
  setUsers,
}) => {
  const greentext = { color: 'rgb(0, 200, 0)' };
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
  const [userBio, setUserBio] = useState('');
  const updateBio = async () => {
    let user = { ...auth };
    user.bio = userBio;
    const usersCopy = [...users];
    const userIndex = users.indexOf(auth);
    const updatedUser = (
      await axios.put(`/api/users/${auth.id}/updatebio`, user)
    ).data;
    usersCopy.splice(userIndex, 1, updatedUser);
    setUsers(usersCopy);
  };

  return (
    <div id="userSettingsPage">
      <h3>User Settings</h3>
      <Link to={`/users/${auth.id}`} onClick={(ev) => setUserView(auth)}>
        <h5>
          <b style={greentext}>View Profile</b>
        </h5>
      </Link>
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

      <hr className="hr" />

      <h5 className="text-center mb-4">
        <b>Upload Profile Photo!</b>
      </h5>

      <FileUpload auth={auth} />
      <hr className="hr" />
      <textarea
        id="updateBio"
        placeholder="Update Bio"
        maxLength="300"
        value={userBio}
        onChange={(e) => setUserBio(e.target.value)}
      />
      <button id="changeButton" onClick={updateBio}>
        <h5>
          <b>Submit Change</b>
        </h5>
      </button>

      <hr className="hr" />

      <form id="changePasswordForm" onSubmit={onPassSubmit}>
        <h5>
          <b>Change Password</b>
        </h5>
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

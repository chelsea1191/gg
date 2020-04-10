import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const UserProfile = ({ auth, changePassword, setUserView }) => {
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
    <div id="userSettingsPage">
      <h3>User Settings</h3>
      <Link to={`/users/${auth.id}`} onClick={(ev) => setUserView(auth)}>
        <h5>
          <b>View Profile</b>
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

      <form
        id="imageUploadForm"
        action="upload.php"
        method="post"
        encType="multipart/form-data"
      >
        <h5>
          <b>Add a Profile Picture</b>
        </h5>
        <input type="file" name="imageToUpload" id="imageToUpload" />
        <input
          id="submitImageButton"
          type="submit"
          value="Upload"
          name="submitImage"
        />
      </form>

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

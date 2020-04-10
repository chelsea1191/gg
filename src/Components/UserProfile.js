import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div id="userProfile">
      <img className="userProfileImage" />
      <h4>
        <b>{user.username}</b>
      </h4>

      <button type="button">Add to Friends</button>
      <h6>
        <i>{user.bio}</i>
      </h6>
    </div>
  );
};

export default UserProfile;

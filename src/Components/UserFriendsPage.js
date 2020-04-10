import React from 'react';

const UserFriendsPage = ({ user }) => {
  return (
    <div id="userFriendsPage">
      <h3>{user.username}'s Friends</h3>
    </div>
  );
};

export default UserFriendsPage;

import React from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const UserFriendsPage = ({
  user,
  friendships,
  setFriendships,
  auth,
  setUserView,
}) => {
  let userFriendsList = [];

  return (
    <div id="userFriendsPage">
      <h3>{user.username}'s Friends</h3>
      {userFriendsList}
    </div>
  );
};

export default UserFriendsPage;

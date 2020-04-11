import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const UserProfile = ({ user, setFriendsView }) => {
  return (
    <div id="userProfile">
      <img className="userProfileImage" />
      <h4>
        <b>{user.username}</b>
      </h4>

      <button type="button">Add to Friends</button>

      <Link
        to={`/users/${user.id}/friends`}
        onClick={(ev) => setFriendsView(user)}
      >
        <h5>
          <b>Friends (#)</b>
        </h5>
      </Link>
      <h6>
        <i># Mutual</i>
      </h6>
      <h6>
        <Link
          to={`/users/${user.id}/favoriteGames`}
          onClick={(ev) => setFriendsView(user)}
        >
          <h5>
            <b>Favorite Games</b>
          </h5>
        </Link>
        <h6>
          <i># Mutual</i>
        </h6>
        <i>{user.bio}</i>
      </h6>
    </div>
  );
};

export default UserProfile;

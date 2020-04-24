import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const UserProfile = ({ user, setFriendsView, favoriteGames, allGames }) => {
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose File');

  const userFavorites = favoriteGames.filter((game) => {
    if (game) {
      return game.userId === user.id;
    }
  });

  return (
    <div id="userProfile">
      <img src={`avatar`} className="userProfileImage" />

      <form
        id="imageUploadForm"
        action="/upload"
        method="POST"
        encType="multipart/form-data"
      >
        <h5>
          <b>Add a Profile Picture</b>
        </h5>
        <input type="file" name="avatar" id="imageToUpload" />
        <input type="submit" value="upload" name="submitImage" />
      </form>

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

      <Link
        to={`/users/${user.id}/favoriteGames`}
        onClick={(ev) => setFriendsView(user)}
      >
        <h5>
          <b>Favorite Games ({userFavorites.length})</b>
        </h5>
      </Link>

      <h6>
        <i># Mutual</i>
      </h6>
      <h6>
        <i>{user.bio}</i>
      </h6>
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Axios from 'axios';

const UserProfile = ({
  user,
  setFriendsView,
  favoriteGames,
  allGames,
  friendships,
  setFriendships,
  users,
  auth,
}) => {
  const userFavorites = favoriteGames.filter((game) => {
    return game.userId === user.id;
  });

  const addFriend = async () => {
    const friendshipsCopy = [...friendships];
    let newFriendshipObject = {
      userId: auth.id,
      friendId: user.id,
      sendStatus: 'sent',
    };

    const receivedRequest = friendships.find((friendship) => {
      return friendship.userId === user.id && friendship.friendId === auth.id;
    });
    if (receivedRequest !== undefined) {
      newFriendshipObject.sendStatus = 'confirmed';

      const receivedRequestCopy = { ...receivedRequest };
      const receivedRequestIndex = friendships.indexOf(receivedRequest);
      receivedRequestCopy.sendStatus = 'confirmed';
      const updatedFriendship = (
        await Axios.put(
          `/api/friendships/${receivedRequest.id}`,
          receivedRequestCopy
        )
      ).data;
      friendshipsCopy.splice(receivedRequestIndex, 1, receivedRequestCopy);
    }

    const newFriendship = (
      await Axios.post('/api/friendships', newFriendshipObject)
    ).data;

    setFriendships([...friendshipsCopy, newFriendship]);
  };

  const confirmedFriendships = friendships.filter((friendship) => {
    return (
      friendship.userId === user.id && friendship.sendStatus === 'confirmed'
    );
  });

  return (
    <div id="userProfile">
      <img src="" className="userProfileImage" />

      <h4>
        <b>{user.username}</b>
      </h4>

      <button type="button" className="addFriendButton" onClick={addFriend}>
        <h5>Add to Friends</h5>
      </button>

      <Link
        to={`/users/${user.id}/friends`}
        onClick={(ev) => setFriendsView(user)}
      >
        <h5>
          <b>Friends ({confirmedFriendships.length})</b>
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

      <p>{user.bio}</p>
    </div>
  );
};

export default UserProfile;

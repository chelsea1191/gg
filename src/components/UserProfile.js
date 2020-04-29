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
  console.log(auth);

  const userFavorites = favoriteGames.filter((game) => {
    if (game) {
      return game.userId === user.id;
    }
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
    console.log(newFriendshipObject);
    await Axios.post('/api/friendships', newFriendshipObject)
      .then((res) => {
        setFriendships([...friendshipsCopy, newFriendshipObject]);
      })
      .catch((err) => alert('friend request already sent'));

    // const newFriendship = (
    //   await Axios.post('/api/friendships', newFriendshipObject)
    // ).data;

    // setFriendships([...friendshipsCopy, newFriendship]);
  };

  const confirmedFriendships = friendships.filter((friendship) => {
    return (
      friendship.userId === user.id && friendship.sendStatus === 'confirmed'
    );
  });

  return (
    <div id="userProfile">
      <img src={`${user.avatar}`} className="userProfileImage" />

      <h4>
        <b>{user.username}</b>
      </h4>

      <button type="button" className="addFriendButton" onClick={addFriend}>
        <h5>Add to Friends</h5>
      </button>
      <hr className="hr" />
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
      <hr className="hr" />

      <p>{user.bio}</p>
      {console.log(auth)}
    </div>
  );
};

export default UserProfile;

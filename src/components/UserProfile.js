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
    if (game) {
      return game.userId === user.id;
    }
  });

  const addFriend = async () => {
    const friendshipsCopy = [...friendships];
    const newFriendship = await Axios.post('/api/friendships', {
      userId: auth.id,
      friendId: user.id,
    }).data;
    const friendRequests = friendships.filter((friendship) => {
      if (friendship) {
        friendship.userId === user.id && friendship.friendId === auth.id;
      }
    });
    if (friendRequests.length === 1) {
      const friendRequestCopy = { ...friendRequests[0] };
      const friendRequestIndex = friendships.indexOf(friendRequestCopy);
      friendRequestCopy.status === 'confirmed';
      await Axios.put(
        `/api/friendships/${friendRequestCopy.id}`,
        friendRequestCopy
      );
      friendshipsCopy.splice(friendRequestIndex, 1, friendRequestCopy);
      newFriendship.status = 'confirmed';
    }

    setFriendships([...friendshipsCopy, newFriendship]);
  };

  const confirmedFriendships = friendships.filter((friendship) => {
    if (friendship) {
      friendship.userId === user.Id && friendship.status === 'confirmed';
    }
  });
  const userFriends = confirmedFriendships.map((friendship) => {
    const friend = users.find((user) => user.id === friendship.friendId);
    return friend;
  });

  return (
    <div id="userProfile">
      <img src="" className="userProfileImage" />

      <h4>
        <b>{user.username}</b>
      </h4>

      <button type="button" onClick={addFriend}>
        <h5>Add to Friends</h5>
      </button>

      <Link
        to={`/users/${user.id}/friends`}
        onClick={(ev) => setFriendsView(user)}
      >
        <h5>
          <b>Friends ({userFriends.length})</b>
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

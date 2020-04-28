import React from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const UserFriendsPage = ({
  users,
  user,
  friendships,
  setFriendships,
  auth,
  setUserView,
}) => {
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
    if (friendship) {
      return (
        friendship.userId === user.id && friendship.sendStatus === 'confirmed'
      );
    }
  });

  const userFriends = confirmedFriendships.map((friendship) => {
    const friend = users.find((u) => u.id === friendship.friendId);
    return friend;
  });

  const userFriendsList = userFriends.map((friend, i) => {
    return (
      <li key={i} className="userFriendsListItem">
        <img src={`avatar`} className="userProfileImage" />
        <h5>{friend.username}</h5>
        <button className="addFriendButton" onClick={addFriend}>
          <h5>Add</h5>
        </button>
      </li>
    );
  });

  return (
    <div id="userFriendsPage">
      <h3>{user.username}'s Friends</h3>
      <ul>{userFriendsList}</ul>
    </div>
  );
};

export default UserFriendsPage;

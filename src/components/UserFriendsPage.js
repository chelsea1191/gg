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

  const userFriends = confirmedFriendships.map((friendship) => {
    const friend = users.find((u) => u.id === friendship.friendId);
    return friend;
  });

  const userFriendsList = [];

  return (
    <div id="userFriendsPage">
      <h3>{user.username}'s Friends</h3>
      {userFriendsList}
    </div>
  );
};

export default UserFriendsPage;

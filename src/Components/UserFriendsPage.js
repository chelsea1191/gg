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
    const newFriendship = await Axios.post('/api/friendships', {
      userId: auth.id,
      friendId: user.id,
    }).data;
    const friendRequests = friendships.filter(
      (friendship) =>
        friendship.userId === user.id && friendship.friendId === auth.id
    );
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

  const confirmedFriendships = friendships.filter(
    (friendship) =>
      friendship.userId === user.Id && friendship.status === 'confirmed'
  );

  const userFriendsList = confirmedFriendships.map((friendship) => {
    const friend = users.find((user) => user.id === friendship.userId);

    return (
      <li key={friend.id} className="friendsListItem">
        <Link to={`/users/${friend.id}`} onClick={(ev) => setUserView(friend)}>
          <h5>{friend.username}</h5>
        </Link>

        <button type="button" onClick={addFriend}>
          <h5>Add Friend</h5>
        </button>
        <hr className="hr" />
      </li>
    );
  });

  return (
    <div id="userFriendsPage">
      <h3>{user.username}'s Friends</h3>
      {userFriendsList}
    </div>
  );
};

export default UserFriendsPage;

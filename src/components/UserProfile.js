import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


const UserProfile = ({
  user,
  setFriendsView,
  favoriteGames,
  allGames,
  // friendships,
  // setFriendships,
  users,
  auth,
}) => {
  const [friendships, setFriendships] = useState([]);
  const [confirmedFriendships, setConfirmedFriendships] = useState(0);
  useEffect(() => {
    axios.get('/api/friendships').then((response) => {
      setFriendships(response.data);
      let confirmed = 0;
      response.data.map((friendship) => {
        if (
          (friendship.userId === user.id &&
            friendship.sendStatus === 'confirmed') ||
          (friendship.friendId === user.id &&
            friendship.sendStatus === 'confirmed')
        ) {
          confirmed = confirmed + 1;
        }
      });
      setConfirmedFriendships(confirmed);
    });
  }, []);

  const notifyPending = () => {
    toast.success('Success! Friend Request sent', {
      className: 'createUserToastSuccess',
      position: 'bottom-center',
      hideProgressBar: false,
    });
  };
  const notifyAlreadySent = () => {
    toast.success('You have already sent a friend request', {
      className: 'createUserToastFailure',
      position: 'bottom-center',
      hideProgressBar: false,
    });
  };
  const notifyConfirmed = () => {
    toast.success('Confirmed! You are now friends', {
      className: 'createUserToastSuccess',
      position: 'bottom-center',
    });
  };
  const notifyFailure = () => {
    toast.success('You are already friends with this user', {
      className: 'createUserToastFailure',
      position: 'bottom-center',
    });
  };

  const userFavorites = favoriteGames.filter((game) => {
    if (game) {
      return game.userId === user.id;
    }
  });
  // const addFriend = async () => {
  //   const friendshipsCopy = [...friendships];
  //   let newFriendshipObject = {
  //     userId: auth.id,
  //     friendId: user.id,
  //     sendStatus: 'sent',
  //   };

  //   const receivedRequest = friendships.find((friendship) => {
  //     return (
  //       (friendship.userId === user.id && friendship.friendId === auth.id) ||
  //       (friendship.userId === auth.id && friendship.friendId === user.id)
  //     );
  //   });
  //   if (receivedRequest !== undefined) {
  //     newFriendshipObject.sendStatus = 'confirmed';
  //     const receivedRequestCopy = { ...receivedRequest };
  //     const receivedRequestIndex = friendships.indexOf(receivedRequest);
  //     receivedRequestCopy.sendStatus = 'confirmed';
  //     const updatedFriendship = (
  //       await Axios.put(
  //         `/api/friendships/${receivedRequest.id}`,
  //         receivedRequestCopy
  //       )
  //     ).data;
  //     friendshipsCopy.splice(receivedRequestIndex, 1, receivedRequestCopy);
  //   }
  //   console.log(newFriendshipObject);
  //   await Axios.post('/api/friendships', newFriendshipObject)
  //     .then((res) => {
  //       setFriendships([...friendshipsCopy, newFriendshipObject]);
  //     })
  //     .catch((err) => alert('friend request already sent'));

  //   // const newFriendship = (
  //   //   await Axios.post('/api/friendships', newFriendshipObject)
  //   // ).data;

  //   // setFriendships([...friendshipsCopy, newFriendship]);
  // };

  const addFriend = (ev) => {
    ev.preventDefault();
    if (friendships.length > 0) {
      friendships.map((friendship) => {
        if (
          //confirmed
          (friendship.userId === user.id &&
            friendship.friendId === auth.id &&
            friendship.sendStatus === 'confirmed') ||
          (friendship.friendId === user.id &&
            friendship.userId === auth.id &&
            friendship.sendStatus === 'confirmed')
        ) {
          notifyFailure();
        } else if (
          (friendship.userId === user.id &&
            friendship.friendId === auth.id &&
            friendship.sendStatus === 'sent') ||
          (friendship.userId === auth.id &&
            friendship.friendId === user.id &&
            friendship.sendStatus === 'sent')
        ) {
          if (friendship.userId === auth.id) {
            notifyAlreadySent();
          } else {
            axios.put(`/api/friendships/${friendship.id}`).then((res) => {
              axios.get('/api/friendships').then((response) => {
                setFriendships([...friendships, response.data]);
                notifyConfirmed();
                setConfirmedFriendships(confirmedFriendships + 1);
              });
            });
          }
        } else {
          axios
            .post('/api/friendships', {
              userId: auth.id,
              friendId: user.id,
            })
            .then((res) => {
              notifyPending();
              setFriendships([...friendships, res.data]);
            });
        }
      })
    }
  }

  //get all friendships
  //loop through each friendship and see if both users are involved in one already. if so, return that friendship as the pending const
  //if pending, simply send that id back to the db to set status to confirmed
  //if not pending, create a new one with these user
  return (
    <div id='userProfile'>
      <img src={`${user.avatar}`} className='userProfileImage' />
      <h4>
        <b>{user.username}</b>
      </h4>

      {auth.id !== user.id && (
        <div>
          <button
            type='button'
            className='addFriendButton'
            onClick={(ev) => addFriend(ev)}>
            <h5>Add to Friends</h5>
          </button>
          <ToastContainer closeButton={false} />
        </div>
      )}
      <hr className='hr' />
      {auth.id !== user.id && (
        <button
          type='button'
          className='addFriendButton'
          onClick={(ev) => addFriend(ev)}>
          <h5>Add to Friends</h5>
        </button>
      )}
      <hr className='hr' />
      <Link
        to={`/users/${user.id}/friends`}
        onClick={(ev) => setFriendsView(user)}>
        <h5>
          <b>Friends ({confirmedFriendships})</b>
        </h5>
      </Link>
      <h6>
        <i># Mutual</i>
      </h6>

      <Link
        to={`/users/${user.id}/favoriteGames`}
        onClick={(ev) => setFriendsView(user)}>
        <h5>
          <b>Favorite Games ({userFavorites.length})</b>
        </h5>
      </Link>

      <h6>
        <i># Mutual</i>
      </h6>
      <hr className='hr' />

      <p>{user.bio}</p>
      { console.log(auth)}
    </div >
  );
};

export default UserProfile;

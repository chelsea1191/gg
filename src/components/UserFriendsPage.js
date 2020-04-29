import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const UserFriendsPage = ({ users, user, auth, setUserView }) => {
  const [friendships, setFriendships] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    axios.get('/api/friendships').then((response) => {
      setFriendships(response.data);
      //console.log('all friendships: ', response.data);
      response.data.map((friendship) => {
        let tempArray = [];
        if (friendship.userId === user.id || friendship.friendId === user.id) {
          tempArray.push(friendship);
        }
        //console.log('userFriendships: ', tempArray);
        let arrayOfUsers = [];
        tempArray.map((eachFriendship) => {
          users.map((eachUser) => {
            if (eachFriendship.friendId === eachUser.id) {
              arrayOfUsers.push(eachUser);
            }
          });
        });
        //console.log('friends: ', arrayOfUsers);
        setUserFriends(arrayOfUsers);
      });
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

  const addFriend = (ev) => {
    ev.preventDefault();
    console.log('addFriend clicked with id: ', ev);
    if (friendships.length > 0) {
      friendships.map((friendship) => {
        if (
          //confirmed
          (friendship.userId === ev.target.value &&
            friendship.friendId === auth.id &&
            friendship.sendStatus === 'confirmed') ||
          (friendship.friendId === ev.target.value.id &&
            friendship.userId === auth.id &&
            friendship.sendStatus === 'confirmed')
        ) {
          console.log('already friends');
          notifyFailure();
        } else if (
          (friendship.userId === ev.target.value.id &&
            friendship.friendId === auth.id &&
            friendship.sendStatus === 'sent') ||
          (friendship.userId === auth.id &&
            friendship.friendId === ev.target.value.id &&
            friendship.sendStatus === 'sent')
        ) {
          if (friendship.userId === auth.id) {
            console.log('already sent');
            notifyAlreadySent();
          } else {
            console.log('pending and confirmed');
            axios.put(`/api/friendships/${friendship.id}`).then((res) => {
              axios.get('/api/friendships').then((response) => {
                setFriendships([...friendships, response.data]);
                notifyConfirmed();
              });
            });
          }
        } else {
          console.log('new friendship');
          axios
            .post('/api/friendships', {
              userId: auth.id,
              friendId: ev.target.value,
            })
            .then((res) => {
              notifyPending();
              setFriendships([...friendships, res.data]);
            });
        }
      });
    } else {
      console.log('new friendship');
      axios
        .post('/api/friendships', {
          userId: auth.id,
          friendId: ev.target.value,
        })
        .then((res) => {
          notifyPending();
          setFriendships([...friendships, res.data]);
        });
    }
  };
  // const addFriend = async () => {
  //   const friendshipsCopy = [...friendships];
  //   let newFriendshipObject = {
  //     userId: auth.id,
  //     friendId: user.id,
  //     sendStatus: 'sent',
  //   };

  //   const receivedRequest = friendships.find((friendship) => {
  //     return friendship.userId === user.id && friendship.friendId === auth.id;
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

  //   const newFriendship = (
  //     await Axios.post('/api/friendships', newFriendshipObject)
  //   ).data;

  //   setFriendships([...friendshipsCopy, newFriendship]);
  // };

  // const confirmedFriendships = friendships.filter((friendship) => {
  //   if (friendship) {
  //     return (
  //       friendship.userId === user.id && friendship.sendStatus === 'confirmed'
  //     );
  //   }
  // });

  // const userFriends = confirmedFriendships.map((friendship) => {
  //   const friend = users.find((u) => u.id === friendship.friendId);
  //   return friend;
  // });

  // const userFriendsList = userFriends.map((friend, i) => {
  //   return (
  //     <li key={i} className="userFriendsListItem">
  //       <img src={friend.avatar} className="userProfileImage" />
  //       <h5>{friend.username}</h5>
  //       <button className="addFriendButton" onClick={addFriend}>
  //         <h5>Add</h5>
  //       </button>
  //     </li>
  //   );
  // });

  return (
    <div id='userFriendsPage'>
      <h3>{user.username}'s Friends</h3>
      <ul>
        {userFriends.map((eachUserFriend) => {
          console.log('eachUserFriend: ', eachUserFriend);
          return (
            <li
              key={eachUserFriend.id}
              value={eachUserFriend.id}
              className='userFriendsListItem'>
              <img src={eachUserFriend.avatar} className='userProfileImage' />
              <h5>{eachUserFriend.username}</h5>{' '}
              {/* <button
                value={eachUserFriend.id}
                className='addFriendButton'
                onClick={(ev) => addFriend(ev)}>
                <h5>Add</h5>{' '}
              </button> */}
              <ToastContainer closeButton={false} />{' '}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserFriendsPage;

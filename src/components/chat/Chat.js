import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import FindPlayers from '../FindPlayers';

const Chat = ({ auth, users, friendships }) => {
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  var friendArray = [];

  //search for existing chats if theres are none create one!
  useEffect(() => {
    axios.get(`/api/chat/${auth.id}`).then((response) => {
      console.log(
        response.data,
        'this is my response finding chats for this user'
      );
      setChats(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/friendships/${auth.id}`).then((response) => {
      console.log(response.data);
      setFriends(response.data);
    });
  }, []);

  useEffect(() => {
    friendships.map((friendship) => {
      axios.get(`/api/chat/${friendship.friendId}`).then((response) => {
        friendArray.push(response.data);
      });
      setFriends(friendArray);
    });
  }, []);

  if ((!chats || chats.length === 0) && friends.length === 0) {
    return (
      <div id='chatPage'>
        <h3>Chat</h3>

        <Link to='/findplayers'>Find some new players to chat with!</Link>
      </div>
    );
  } else if (chats.length > 0) {
    console.log('chats: ', chats);
    return (
      <div id='chatPage'>
        <h3>Chat</h3>
        <hr></hr>
        Continue a chat already in progress:
        {chats.map((eachChat) => {
          console.log('eachChat: ', eachChat);
          return (
            <div key={eachChat.id}>
              {users.map((eachUser) => {
                if (
                  (eachChat.user_id === eachUser.id &&
                    eachUser.user_id != auth.id) ||
                  (eachChat.creator_id === eachUser.id &&
                    eachUser.creator_id != auth.id)
                ) {
                  return (
                    <div key={eachUser.id}>
                      <Link to={`/chat/${eachUser.id}`}>
                        {eachUser.username}
                        {eachUser.isOnline ? (
                          <span className='dot-green'></span>
                        ) : (
                          <span className='dot-red'></span>
                        )}
                      </Link>
                      <hr></hr>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div id='chatPage'>
        <hr></hr>
        Chat with Friends:
        {friends.map((friend) => {
          if (friend.id != auth.id) {
            return (
              <div key={friend.friendId}>
                <span>
                  <Link to={`/chat/${friend.friendId}`}>
                    {friend.username}
                    {friend.isOnline ? (
                      <span className='dot-green'></span>
                    ) : (
                      <span className='dot-red'></span>
                    )}
                  </Link>
                </span>
              </div>
            );
          }
        })}
      </div>
    );
  }
};

export default Chat;

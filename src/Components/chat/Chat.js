import { ChatFeed, Message } from 'react-chat-ui';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import io from 'socket.io-client';
import UserChat from './UserChat';

const Chat = ({ auth, users, match }) => {
  const messageArray = [];
  const [chat, setChat] = useState([]);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState([]);

  console.log(match, 'the path');

  //search for existing chats if theres are none create one!
  useEffect(() => {
    if (user.id) {
      axios.get(`/api/chat/${user.id}/${auth.id}`).then((response) => {
        if (!response.data) {
          axios.post('/api/createchat', [auth.id, user.id]).then((response) => {
            setChat(response.data);
          });
        } else {
          setChat(response.data);
        }
      });
    }
    axios.get(`/api/chat/${auth.id}`).then((response) => {
      if (response.data.length) {
        setChats(response.data);
      } else {
        setChats(null);
      }
    });
  }, [user]);

  if (!chats || chats === []) {
    return (
      <div>
        {' '}
        Find some users to have a chat with!
        {users.map((eachUser) => {
          if (eachUser.id != auth.id) {
            return (
              <div key={eachUser.id}>
                <Link
                  to={`/chat/${eachUser.id}`}
                  onClick={() => setUser(eachUser)}>
                  {eachUser.firstname + ' ' + eachUser.lastname}
                </Link>
              </div>
            );
          }
        })}
      </div>
    );
  } else {
    console.log(chats);
    return (
      <div>
        Chats already in progress:
        {chats.map((eachChat) => {
          return (
            <div key={eachChat.id}>
              {users.map((eachUser) => {
                if (eachChat.user_id === eachUser.id) {
                  console.log(eachUser);
                  return (
                    <div key={eachUser.id}>
                      <Link
                        to={`/chat/${eachUser.id}`}
                        onClick={() => {
                          setUser(eachUser);
                        }}>
                        {eachUser.firstname + eachUser.lastname}
                      </Link>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  }
};

export default Chat;

//add delete feature - add two tables in db and have it be renderuser default false
//then upon useeffect if render user is false dont get the old messages

//add online as well
//add notifications for chat -

//separate find players and chat more -

/*In find players
//upon clicking the players name - find players component should pass the user through to chat - roght now using local storage
//then make an http request to see if there is an existing chat or create a new chat if there is a new one
//then take the chat object and ssend it to chat component - right now using local storage

In chat component
run useeffect to look for any messages with the chat id - display messages using set messages

on submit - send the message via http request to save in db and use socket io for the realtime chat portion


*/

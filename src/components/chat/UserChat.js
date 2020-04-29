import { ChatFeed, Message } from 'react-chat-ui';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';
import * as io from 'socket.io-client';

export default function UserChat({ auth, match, setUserView }) {
  var socket = io.connect({ transports: ['websocket'] });
  const messageArray = [];
  const [user, setUser] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chat, setChat] = useState([]);

  const greentext = { color: 'rgb(0, 200, 0)' };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    // new Message({
    //   id: 1,
    //   message: "I'm the recipient! (The person you're talking to)",
    // }), // Gray bubble
    // new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
  ]);

  useEffect(() => {
    axios.get(`/api/user/${match.params.id}`).then((response) => {
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    if (user.id) {
      axios.get(`/api/chat/${user.id}/${auth.id}`).then((response) => {
        if (!response.data) {
          axios
            .post('/api/createchat', [
              auth.id,
              auth.username,
              user.id,
              user.username,
            ])
            .then((response) => {
              setChat(response.data);
            });
        } else {
          setChat(response.data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (chat.id) {
      axios.get(`/api/getMessages/${chat.id}`).then((response) => {
        response.data.forEach((messageObj) => {
          if (messageObj.sender_id === auth.id) {
            messageArray.push(
              new Message({
                id: 0,
                message: messageObj.message,
              })
            );
          } else {
            messageArray.push(
              new Message({
                id: 1,
                message: messageObj.message,
              })
            );
          }
        });
        setMessages([...messageArray]);
      });
    }
  }, [chat]);

  ////SOCKET STUFF///

  socket.on('connect', function () {
    socket.emit('create', chat.id);
  });

  socket.on('chat message', (msg) => {
    const socketMessage = JSON.parse(msg);
    if (socketMessage.sender_id === auth.id) {
      setMessages([
        ...messages,
        new Message({ id: 0, message: socketMessage.message }),
      ]);
    } else {
      setMessages([
        ...messages,
        new Message({
          id: 1,
          message: socketMessage.message,
        }),
      ]);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit(
      'chat message',
      JSON.stringify({
        chat_id: chat.id,
        sender_id: auth.id,
        message: message,
        time: moment(),
        typing: 'yes',
      })
    );
    setMessage('');
    setIsTyping(false);
  };

  return (
    <div id="chatPage">
      <span>
        <div id="chatHeader">
          <Link className="xButton" to="/chat" onClick={() => setUser('')}>
            <b>X</b>
          </Link>
          {'    '}
          <b>Chatting with:{'  '}</b>

          <Link
            className="userChatLink"
            to={`/users/${user.id}`}
            onClick={(ev) => setUserView(user)}
          >
            <b style={greentext}>{user.username}</b>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <ChatFeed
            messages={messages} // Boolean: list of message objects
            isTyping={isTyping} // Boolean: is the recipient typing
            hasInputField={false} // Boolean: use our input, or use your own
            bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
            // JSON: Custom bubble styles
            bubbleStyles={{
              text: {
                fontSize: 16,
              },
              chatbubble: {
                borderRadius: 70,
                padding: 8,
              },
            }}
          />
          <input
            type="text"
            value={message}
            onChange={(ev) => {
              setMessage(ev.target.value);
              socket.emit('typing', () => isTyping(true));
            }}
            placeholder="Chat..."
          />
          <button>
            <h5>
              <b>Submit</b>
            </h5>
          </button>
        </form>
      </span>
    </div>
  );
}

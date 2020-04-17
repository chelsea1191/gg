import { ChatFeed, Message } from 'react-chat-ui';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import io from 'socket.io-client';

const Chat = ({ auth }) => {
  var socket = io();
  const [refreshMessage, setRefreshMessage] = useState('');
  const [message, setMessage] = useState('');
  const messageArray = [];
  // const [localUser, setLocalUser] = useState([]);
  // const [locaChat, setLocalChat] = useState([]);

  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    // new Message({
    //   id: 1,
    //   message: "I'm the recipient! (The person you're talking to)",
    // }), // Gray bubble
    // new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
  ]);

  const localUser = JSON.parse(window.localStorage.getItem('user'));
  const localChat = JSON.parse(window.localStorage.getItem('chat'));
  // useEffect(() => {
  // let localUserIfPresent = JSON.parse(window.sessionStorage.getItem('user'));
  // let localChatIfPresent = JSON.parse(window.sessionStorage.getItem('chat'));
  //   if (localUserIfPresent) {
  //     setLocalUser(localUserIfPresent);
  //   }
  //   if (localChatIfPresent) {
  //     setLocalChat(localChatIfPresent);
  //   }
  // }, [setLocalUser, setLocalChat]);

  // const getMessages = async (id) => {
  //   const response = await axios.get(`/api/getMessages/${id}`);
  //   response.data.forEach((messageObj) => {
  //     if (messageObj.sender_id === auth.id) {
  //       messageArray.push(
  //         new Message({
  //           id: 0,
  //           message: messageObj.message,
  //           senderName: messageObj.sender_id,
  //         })
  //       );
  //     } else {
  //       messageArray.push(
  //         new Message({
  //           id: 1,
  //           message: messageObj.message,
  //           senderName: messageObj.sender_id,
  //         })
  //       );
  //     }
  //     setMessages([...messageArray]);
  //   });
  // };

  // useEffect(() => {
  //   getMessages(localChat.id);
  // }, []);

  useEffect(() => {
    axios.get(`/api/getMessages/${localChat.id}`).then((response) => {
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
        setMessages([...messageArray]);
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/sendMessages', [localChat.id, auth.id, message, moment()])
      .then((response) => {
        console.log(response);
        socket.emit(
          'chat message',
          JSON.stringify({
            message: message,
            sender_id: response.data.sender_id,
            typing: 'yes',
          })
        );
      });
    socket.on('is typing', (isTyping) => {
      setIsTyping(true);
    });
    socket.on('chat message', (msg) => {
      const socketMessage = JSON.parse(msg);
      console.log(
        socketMessage.sender_id === auth.id,
        'should be true always right nows',
        socketMessage.sender_id
      );
      if (socketMessage.sender_id === auth.id) {
        console.log(auth.id, 'i send this one it should be a blue bubble');
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
    setMessage('');
    setIsTyping(false);
  };

  return (
    <div id="chatPage">
      <span>
        <Link
          to="/"
          onClick={() => {
            localStorage.removeItem('chat');
            localStorage.removeItem('user');
          }}
        >
          X
        </Link>
        Chat with: {localUser.firstname + localUser.lastname}
        <form onSubmit={handleSubmit}>
          <ChatFeed
            messages={messages} // Boolean: list of message objects
            isTyping={isTyping} // Boolean: is the recipient typing
            hasInputField={false} // Boolean: use our input, or use your own
            bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
            // JSON: Custom bubble styles
            bubbleStyles={{
              text: {
                fontSize: 12,
              },
              chatbubble: {
                borderRadius: 70,
                padding: 16,
              },
            }}
          />
          <input
            type="text"
            value={message}
            onChange={(ev) => {
              setMessage(ev.target.value);
            }}
            placeholder="message"
          />
          <button>Submit</button>
        </form>
      </span>
    </div>
  );
};

export default Chat;

//add delete feature - add two tables in db and have it be renderuser default false
//then upon useeffect if render user is false dont get the old messages

//add online as well

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

  const localUser = JSON.parse(window.sessionStorage.getItem('user'));
  const localChat = JSON.parse(window.sessionStorage.getItem('chat'));
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

  const getMessages = async (id) => {
    const response = await axios.get(`/api/getMessages/${id}`);
    console.log(response.data, 'the response');
    response.data.forEach((messageObj) => {
      console.log(messageObj);
      if (messageObj.sender_id === auth.id) {
        console.log(
          messageObj.message,
          'this is the message from the logged in user'
        );
        messageArray.push(
          new Message({
            id: 0,
            message: messageObj.message,
            senderName: messageObj.sender_id,
          })
        );
      } else {
        messageArray.push(
          new Message({
            id: 1,
            message: messageObj.message,
            senderName: messageObj.sender_id,
          })
        );
      }
      setMessages([...messageArray]);
    });
  };

  useEffect(() => {
    getMessages(localChat.id);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/sendMessages', [localChat.id, auth.id, message, moment()])
      .then((response) => {
        console.log(response, 'my response from sending the message');
        // socket.emit('chat message', response.data);
      });
    socket.emit('chat message', {
      msg: message,
      senderId: response.data.senderId,
    });
    setMessage('');
    //     setMessages([
    //       ...messages,
    //       new Message({ id: 0, message: response.data.message }),
    //     ]);
    //   });

    // // console.log(message);
    // //   .then((response) => setMessage(response.data.message));
    // // setIsTyping(false);
    socket.on('chat message', (msg) => {
      console.log(msg, 'socket msg receive');
      if (msg.sender_id === auth.id) {
        setMessages([new Message({ id: 0, message: msg })]);
      } else {
        setMessages([new Message({ id: 1, message: msg })]);
      }
    });
  };

  return (
    <div id="chatPage">
      <span>
        <Link to="/" onClick={() => sessionStorage.clear()}>
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
              setIsTyping(true);
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

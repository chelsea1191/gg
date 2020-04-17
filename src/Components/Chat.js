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

  const localUser = JSON.parse(window.sessionStorage.getItem('user'));
  const localChat = JSON.parse(window.sessionStorage.getItem('chat'));

  const [messages, setMessages] = useState([
    // new Message({
    //   id: 1,
    //   message: "I'm the recipient! (The person you're talking to)",
    // }), // Gray bubble
    // new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
  ]);
  const [isTyping, setIsTyping] = useState(false);

  /*
when the page loads, look for all emssages with the chat id - then display them on the page bue for logged in user and gray for other user
then when chatting use socket io to display chats but also axios.push the messages

  */

  useEffect(() => {
    axios.get(`/api/getMessages/${localChat.id}`).then((response) => {
      response.data.forEach((messageObj) => {
        if (messageObj.sender_id === auth.id) {
          console.log(
            messageObj.message,
            'this is the message from the logged in user'
          );
          setMessages([
            ...message,
            new Message({
              id: 0,
              message: messageObj.message,
              senderName: messageObj.sender_id,
            }),
          ]);
          // messageArray.push([
          //   new Message({
          //     id: 0,
          //     message: messageObj.message,
          //     senderName: messageObj.sender_id,
          //   }),
          // ]);

          // console.log(messageArray, 'this is the message array after');
        } else {
          messageArray.push([
            new Message({
              id: 1,
              message: messageObj.message,
              senderName: messageObj.sender_id,
            }),
          ]);

          // console.log(
          //   messageObj.message,
          //   'this is the message from the other person'
          // );
          setMessages([
            ...messages,
            new Message({ id: 1, message: messageObj.message }),
          ]);
        }
        //  console.log(messageObj, 'each message');
      });
      // console.log(messageArray, 'this is the message array');
      // console.log(messages, 'this is the messages)');
      //  setMessages([...messages, messageArray]);

      // setMessage(response.data.message);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/sendMessages', [localChat.id, auth.id, message, moment()])
      .then((response) => {
        console.log(response, 'my response from sending the message');
        // socket.emit('chat message', response.data);
        socket.emit('chat message', message);
        setRefreshMessage(response.data.message);
      });
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
      setMessages([
        ...messages,
        new Message({ id: 1, message: msg, senderName: auth.id }),
      ]);
    });
  };

  return (
    <div id="chatPage">
      <span>
        <Link to="/">X</Link>
        Chat with: {localUser.firstname + localUser.lastname}
        <form onSubmit={handleSubmit}>
          <ChatFeed
            messages={messages} // Boolean: list of message objects
            isTyping={isTyping} // Boolean: is the recipient typing
            hasInputField={false} // Boolean: use our input, or use your own
            showSenderName // show the name of the user who sent the message
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

//has no authentication set up and also i think we need to decide if we need to send the chat to the server because right now im just setting the state and that wont work on someone elses browser i think so well need to discuss that//

//for backend - need to make call to db //front end need to look into how to setup the chat so both users can see - will need to anticipate opening up to multi user chats
//once session is over - will send delete request to remove chat from db UNLESS user selects the save chat option.. then can save chat

//click on rfiends name - useeffect looks for any chats from sender and other and loads based on descending time - if there are none then thats fine if there are some then loads all messages from both sender IDs and sets the message id 0 to the blue bubble thats me- where sender if = me, and all from senderid = map user to grey bubbles,
//then when i type and submit a new chat - it will post it to the messages and then useeffect will load again because messages will be a parameter for useeffect to run

//click on friends name - firs tthing that should happen is looking for a chat with person 1 and person  in it in either order and grab the newest one.
//if there are no chats then create a new chat with both parties
//if there is a chat - look for messages with the chat id and load //all messages

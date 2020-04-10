import { ChatFeed, Message } from 'react-chat-ui';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const Chat = ({ auth, users, user, setUser }) => {
  const [chat, setChat] = useState();
  const [responseId, setResponseId] = useState('');
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([
    new Message({
      id: 1,
      message: "I'm the recipient! (The person you're talking to)"
    }), // Gray bubble
    new Message({ id: 0, message: "I'm you -- the blue bubble!" }) // Blue bubble
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // useEffect(() => {
  //   axios.get(`/api/getMessages/${responseId}/${auth.id}`).then(response => {
  //     axios
  //       .get(`/api/getMessages/${auth.id}/${response.data.id}`)
  //       .then(responseTwo => {
  //         console.log(responseTwo, 'my next response');
  //       });
  //   });
  // }, [messages]);

  const handleSubmit = e => {
    e.preventDefault();

    console.log(chat.id, 'the chat id');
    console.log(message, 'the message');

    axios
      .post('/api/sendMessages', [chat.id, auth.id, message, moment()])
      .then(response => console.log(response, 'the response'));

    setMessages([...messages, new Message({ id: 0, message: message })]);
    setIsTyping(false);
  };

  // const handleClick = user => {
  //   const body = [auth.id, user.id];
  //   axios.post('/api/chat', body).then(response => {
  //     if (!response.data) {
  //       console.log('creating chat since there was no previous chat');
  //       axios.post('/api/createchat', [auth.id, user.id]).then(response => {
  //         return response.data;
  //       });
  //       console.log(chat, 'first test that chat was set');
  //     } else {
  //       axios
  //         .get(`/api/getMessages/${response.data.id}/${auth.id}`)
  //         .then(response => console.log(response, 'my next response'));
  //     }
  //     setMessages([
  //       ...messages,
  //       new Message({ id: 0, message: response.data.message }),
  //       new Message({ id: 1, message: response.data.message })
  //     ]);
  //     setChat(response.data);
  //     console.log(chat, 'the chat id in handleclick');
  //   });
  // };

  //when clicking the user you want to chat - create a new chat id in database sending both userids to the db
  //when i type something to my friend - needs to make a post to the db and provide the message for my userid then once i hit submit - post then get from db the messages
  console.log(user);
  return (
    <div id="loginpage">
      <span>
        <button onClick={() => setChat()}>X</button>
        Chat with: {user.firstname + user.lastname}
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
                fontSize: 30
              },
              chatbubble: {
                borderRadius: 70,
                padding: 40
              }
            }}
          />
          <input
            type="text"
            onChange={ev => {
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

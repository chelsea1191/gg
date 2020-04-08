import { ChatFeed, Message } from 'react-chat-ui';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ auth }) => {
  const [chat, setChat] = useState();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    new Message({
      id: 1,
      message: "I'm the recipient! (The person you're talking to)",
    }), // Gray bubble
    new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users').then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(chat.id, 'the chat id');
    console.log(message, 'the message');
    axios
      .post('/api/sendMessages', [chat.id, message])
      .then((response) => console.log(response, 'the response'));

    // setMessages([...messages, new Message({ id: 0, message: message })]);
    // setIsTyping(false);
  };

  const handleClick = async (mapUser) => {
    const body = [auth.id, mapUser.id];
    await axios.post('/api/chat', body).then((response) => {
      if (!response.data) {
        console.log('creating chat since there was no previous chat');
        axios
          .post('/api/createchat', [auth.id, mapUser.id])
          .then((response) => {
            setChat(response.data);
          });
      } else {
        axios
          .get(`/api/getMessages/${response.data.id}/${auth.id}`)
          .then((response) => {
            console.log(response, 'my next response');
          });
        setChat(response.data);
        setMessages([
          ...messages,
          new Message({ id: 0, message: response.data.message }),
        ]);
      }
    });
  };

  //when clicking the user you want to chat - create a new chat id in database sending both userids to the db
  //when i type something to my friend - needs to make a post to the db and provide the message for my userid then once i hit submit - post then get from db the messages
  if (!chat) {
    return (
      <div id="loginpage">
        <ul>
          {users.map((mapUser) => {
            if (mapUser.id != auth.id) {
              return (
                <li key={mapUser.id}>
                  <button onClick={() => handleClick(mapUser)}>
                    {mapUser.firstname + mapUser.lastname}
                  </button>
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  } else {
    console.log(chat);
    return (
      <div id="loginpage">
        <span>
          <button onClick={() => setChat()}>X</button>
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
                  fontSize: 30,
                },
                chatbubble: {
                  borderRadius: 70,
                  padding: 40,
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
  }
};

export default Chat;

//has no authentication set up and also i think we need to decide if we need to send the chat to the server because right now im just setting the state and that wont work on someone elses browser i think so well need to discuss that//

//for backend - need to make call to db //front end need to look into how to setup the chat so both users can see - will need to anticipate opening up to multi user chats
//once session is over - will send delete request to remove chat from db UNLESS user selects the save chat option.. then can save chat

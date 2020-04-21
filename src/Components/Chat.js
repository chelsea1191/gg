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

const Chat = ({ auth, users }) => {
  var socket = io();
  const [message, setMessage] = useState('');
  const messageArray = [];
  const [chat, setChat] = useState([]);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState([]);
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
  useEffect(() => {
    axios.get(`/api/chat/${auth.id}`).then((response) => {
      if (response.data.length) {
        setChats(response.data);
      } else {
        setChats(null);
      }
    });
  }, [user]);

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
      });
      setMessages([...messageArray]);
    }
  }, []);

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
    axios
      .post('/api/sendMessages', [chat.id, auth.id, message, moment()])
      .then((response) => {
        socket.emit(
          'chat message',
          JSON.stringify({
            message: message,
            sender_id: response.data.sender_id,
            typing: 'yes',
          })
        );
      });
    setMessage('');
    setIsTyping(false);
  };

  if (!user.id) {
    if (!chats || chats === []) {
      return (
        <div>
          {' '}
          Find some users to have a chat with!
          {users.map((eachUser) => {
            return (
              <div key={eachUser.id}>
                <Link
                  to={`/chat/${eachUser.id}`}
                  onClick={() => setUser(eachUser)}
                >
                  {eachUser.firstname + eachUser.lastname}
                </Link>
              </div>
            );
          })}
        </div>
      );
    } else {
      console.log(chats);
      return (
        <div>
          {chats.map((eachChat) => {
            // users.map((eachUser) => {
            //   if (eachChat.user_id === eachUser.id) {
            //     console.log(eachChat.user_id, eachUser.id, 'in if statement');
            //     return <div>test</div>;
            //   }
            return (
              <div key={eachChat.id}>
                <Link to={`/chat/${eachChat.user_id}`}>{eachChat.id}</Link>
              </div>
            );
          })}
        </div>
      );
    }
    //           if (eachChat.user_id === eachUser.id) {

    //           } else {
    //             return <div> Hi</div>;
    //           }
    //         });
    //       })
    //     }
    //  </div>
    //  )

    // } else {
    //     return (
    //       <div>
    //         {' '}
    //         Find some users to have a chat with!
    //         {users.map((eachUser) => {
    //           return (
    //             <div key={eachUser.id}>
    //               <Link
    //                 to={`/chat/${eachUser.id}`}
    //                 onClick={() => setUser(eachUser)}
    //               >
    //                 {eachUser.firstname + eachUser.lastname}
    //               </Link>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     );
  } else {
    return (
      <div id="chatPage">
        <span>
          <Link to="/">X</Link>
          Chat with: {user.firstname + user.lastname}
          <form onSubmit={handleSubmit}>
            <ChatFeed
              messages={messages} // Boolean: list of message objects
              isTyping={isTyping} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
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

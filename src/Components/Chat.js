import { ChatFeed, Message } from 'react-chat-ui';
import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [chat, setChat] = useState('');
  const [messages, setMessages] = useState([
    new Message({
      id: 1,
      message: "I'm the recipient! (The person you're talking to)",
    }), // Gray bubble
    new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessages([...messages, new Message({ id: 0, message: chat })]);
    setIsTyping(false);
  };

  return (
    <div id="loginpage">
      <span>
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
              setChat(ev.target.value);
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

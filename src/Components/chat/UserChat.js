import { ChatFeed, Message } from 'react-chat-ui'
import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import io from 'socket.io-client'

export default function UserChat({
  user,
  setUser,
  chat,
  auth,
  match,
  location,
  history,
}) {
  console.log(match, location, history, 'this is user chat')
  var socket = io()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    // new Message({
    //   id: 1,
    //   message: "I'm the recipient! (The person you're talking to)",
    // }), // Gray bubble
    // new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
  ])
  const [isTyping, setIsTyping] = useState(false)
  console.log(match, 'this is userchat')

  // useEffect(() => {
  //   if (chat.id) {
  //     console.log(chat.id, 'this is my chat in userchat')
  //     axios.get(`/api/getMessages/${chat.id}`).then((response) => {
  //       response.data.forEach((messageObj) => {
  //         if (messageObj.sender_id === auth.id) {
  //           messageArray.push(
  //             new Message({
  //               id: 0,
  //               message: messageObj.message,
  //             })
  //           )
  //         } else {
  //           messageArray.push(
  //             new Message({
  //               id: 1,
  //               message: messageObj.message,
  //             })
  //           )
  //         }
  //       })
  //       setMessages([...messageArray])
  //     })
  //   }
  // }, [])

  socket.on('chat message', (msg) => {
    const socketMessage = JSON.parse(msg)
    if (socketMessage.sender_id === auth.id) {
      setMessages([
        ...messages,
        new Message({ id: 0, message: socketMessage.message }),
      ])
    } else {
      setMessages([
        ...messages,
        new Message({
          id: 1,
          message: socketMessage.message,
        }),
      ])
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault()
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
        )
      })
    setMessage('')
    setIsTyping(false)
  }
  return (
    <div id="chatPage">
      <span>
        <Link to="/chat" onClick={() => setUser('')}>
          X
        </Link>
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
              setMessage(ev.target.value)
            }}
            placeholder="message"
          />
          <button>Submit</button>
        </form>
      </span>
    </div>
  )
}
